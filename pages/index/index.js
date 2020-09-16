import common from '../../utils/common.js'
Page({
  data: {
    bannerList: [], // 轮播图
    sortList: [], // 分类
    columnList: [], // 分栏
    hotList: [], // 人气列表

    carNum: '', // 购物车数量
    params: {
      code:'',
      password: 'user123',
      username: 'user123',
    }
  },
  onLoad(opt) {
    this.getData()
  },
  onShow() {
    this.getCarNum()
  },
  // 跳转到商品详情
  toProductDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' +id,
    })
  },
  // 跳转到分类
  toClassification(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/search/seachRecords/seachRecords?id=' + id + '&&name=' + name,
    })
  },

  toCartPage() {
    wx.navigateTo({
      url: '/my/shoppingCart/shoppingCart',
    })
  },
  toInvite() {
    wx.navigateTo({
      url: '/invites/inviteMoney/inviteMoney',
    })
  },
  toSearch() {
    wx.navigateTo({
      url: '/search/seachShop/seachShop',
    })
  },
  // toSearch() {
  //   wx.navigateTo({
  //     url: '/invites/inviteMoney/inviteMoney',
  //   })
  // }
  
  // 首页渲染数据
  getData() {
    let params = {
      url: 'home/index',
      method: 'GET'
    }
    common.request(params).then(res => {
      console.log(res)
      let data = res.data
      this.setData({
        bannerList: data.banner,
        sortList: data.channel,
        columnList: data.topicList,
        hotList: data.hotGoodsList
      })
    })
  },
  // 购物车数量
  getCarNum() {
    let params = {
      url: 'cart/index',
      method: 'GET'
    }
    common.request(params).then(res => {
      this.setData({
        carNum: res.data.cartTotal.goodsCount
      })
    })
  },
  onShareAppMessage() {
    return {
      title: '优心贝·母婴精选',
      path: "",
      imageUrl: '../../static/images/fxt.png'
    }
  },

})