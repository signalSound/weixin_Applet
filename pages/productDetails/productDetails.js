import common from '../../utils/common.js'
import Towxml from '../../utils/towxml/main.js'
let towxml = new Towxml()
Page({
  data: {
    data: {},
    isShow: false,
    content: '',
    goodDetails: false,
    num: 1, //商品数量
    type: 1, //1加入购物车,2立即购买

    num: 1, // 购买数量

    carNum: '', // 购物车数量

    address: {}, // 地址

    specGood: [], // 规格商品

    ltype: 1,

    shareCode: ''
  },
  onLoad(opt) {
    let shareCode = opt.shareCode ? opt.shareCode : ''
    this.setData({
      shareCode
    })
    let id = opt.id
    this.getDetail(id)
  },
  onShow() {
    this.getCarNum()
  },
  // 显示参数
  showCS(e) {
    let ltype = e.currentTarget.dataset.type
    this.setData({
      goodDetails: true,
      ltype
    })
  },
  // 跳转到会员
  toVip() {
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },
  // 选择地址
  toAddressList() {
    wx.navigateTo({
      url: '/orderDetails/addressList/addressList?type=1',
    })
  },
  // 隐藏弹窗
  hidden() {
    this.setData({
      isShow: false,
      goodDetails: false
    })
  },
  // 显示规格弹窗
  showSpec(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      isShow: true,
      type
    })
  },
  toCartPage() {
    wx.navigateTo({
      url: '/my/shoppingCart/shoppingCart',
    })
  },
  toBussDetails() {
    wx.navigateTo({
      url: '/orderDetails/fillOrder/fillOrder',
    })
  },
  // 减少
  sub() {
    let num = this.data.num
    if (num == 1) return wx.showToast({
      title: '数量不能小于1',
      icon: 'none'
    })
    num--
    this.setData({
      num
    })
  },
  // 增加
  add() {
    let num = this.data.num
    num++
    this.setData({
      num
    })
  },
  // 处理规格
  handleSpec(e) {
    let name = e.currentTarget.dataset.name
    let obj = e.currentTarget.dataset.item2
    let specificationList = this.data.data.specificationList
    specificationList.map(item1 => {
      if (item1.name == name) {
        item1.valueList.map(item2 => {
          if (item2.id == obj.id) {
            item2.cur = true
          } else {
            item2.cur = false
          }
        })
      }
    })
    this.data.data.specificationList = specificationList
    this.getSpecGood()
    this.setData({
      data: this.data.data,
    })
  },
  // 获取规格商品
  getSpecGood() {
    let specificationList = this.data.data.specificationList
    let productList = this.data.data.productList
    let specArr = []
    specificationList.map(item1 => {
      item1.valueList.map(item2 => {
        if (item2.cur) {
          specArr.push(item2.value)
        }
      })
    })
    let specGood = productList.filter(item => item.specifications.join('-') == specArr.join('-'))
    this.setData({
      specGood
    })
  },
  // 加入购物车
  addCar() {
    let params = {
      url: 'cart/add',
      data: {
        goodsId: this.data.data.info.id,
        productId: this.data.specGood[0].id,
        number: this.data.num
      },
      method: 'POST'
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })
      this.setData({
        isShow: false
      })
      this.getCarNum()
    })
  },
  // 立即购买
  pay() {
    // let address = this.data.address
    // if (!address.id) return wx.showToast({
    //   title: '请选择收货地址',
    //   icon: 'none'
    // })
    let params = {
      url: 'cart/fastadd',
      data: {
        goodsId: this.data.data.info.id,
        productId: this.data.specGood[0].id,
        number: this.data.num
      },
      method: 'POST'
    }
    common.request(params).then(res => {
      console.log(res)
      let id = res.data
      wx.navigateTo({
        url: '/orderDetails/fillOrder/fillOrder?id='+id+'&&shareCode='+this.data.shareCode+'',
      })
    })
  },
  // 点击确定
  sure() {
    let type = this.data.type
    if (this.data.specGood.length == 0) {
      return wx.showToast({
        title: '请选择完整的商品规格',
        icon: 'none'
      })
    }
    // 加入购物车
    if (type == 1) {
      this.addCar()
    }
    // 立即购买
    if (type == 2) {
      this.pay()
    }
  },
  // 商品详情
  getDetail(id) {
    let params = {
      url: 'goods/detail',
      data: {
        id: id
      }
    }
    common.request(params).then(res => {
      console.log(res)
      let data = res.data

      let content = towxml.toJson(res.data.info.detail, 'html')
      content.theme = 'light';

      data.specificationList.map(item1 => {
        item1.valueList.map(item2 => {
          item2.cur = false
        })
      })

      this.setData({
        data,
        content
      })
    })
  },
  // 购物车数量
  getCarNum() {
    let params = {
      url: '/cart/index',
      method: 'GET'
    }
    common.request(params).then(res => {
      this.setData({
        carNum: res.data.cartTotal.goodsCount
      })
      this.getInviteCode()
    let address = {}
    if (wx.getStorageSync('address')) {
      address = wx.getStorageSync('address')

      this.setData({
        address,
      })
    } else {
      // 获取地址列表
      let params = {
        url: 'address/list',
        method: 'get',
        data: {
          'userId': '1'
        }
      }
      common.request(params).then(res => {
        let addressList = res.data.list
        address = addressList.filter(item => item.isDefault)
        if (address.length) {
          address = address[0]
        } else {
          address = {}
        }
        this.setData({
          address,
        })
      })
    }
    })
  },
  // 获取邀请码
  getInviteCode() {
    let params = {
      url: 'user/code',
      method: 'get',
    }
    common.request(params).then(res => {
      console.log(res)
      this.setData({
        myShareCode: res.data.invitationCode
      })
    })
  },
  onShareAppMessage() {
    let data = this.data.data
    return {
      title: data.info.name,
      path: "/pages/productDetails/productDetails?id="+data.info.id+"&&shareCode="+this.data.myShareCode+"",
      imageUrl: data.info.gallery[0]
    }
  },
})