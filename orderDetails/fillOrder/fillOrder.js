import common from '../../utils/common.js'
Page({
  data: {
    data: {},
    address: {},
    coupon: {},
    isLD: false,

    shareCode: '',

    prepayFlag: true
  },
  onShow() {
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
    let coupon = wx.getStorageSync('coupon') ? wx.getStorageSync('coupon') : {}
    this.setData({
      coupon
    })

  },
  onLoad(opt) {
    let shareCode = opt.shareCode
    let id = opt.id
    this.setData({
      cartId: id,
      shareCode
    })
    this.getInfo()
  },
  handleLD() {
    let isLD = this.data.isLD
    isLD = !isLD
    this.setData({
      isLD
    })
    this.getInfo()
  },
  // 跳转到我的优惠券
  toMyVoucher() {
    wx.navigateTo({
      url: '/my/myVoucher/myVoucher?type=1',
    })
  },
  // 选择地址
  toAddressList() {
    wx.navigateTo({
      url: '/orderDetails/addressList/addressList?type=1',
    })
  },
  // 去付款  获取订单ID
  pay() {
    let address = this.data.address
    if (!address.id) {
      return wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
    }
    let params = {
      url: 'order/submit',
      data: {
        cartId: this.data.data.cartId,
        addressId: address.id,
        couponId: this.data.coupon.id ? this.data.coupon.id : '',
        shareCode: this.data.shareCode,
        prepayFlag: this.data.prepayFlag
      },
      method: 'POST'
    }
    console.log(this.data.shareCode, 'shareCode')
    common.request(params).then(res => {
      let orderId = res.data.orderId
      if(this.data.prepayFlag){
        this.getWXPayVoucher(orderId)
      }else{
        wx.showToast({
          title: "支付成功",
          icon: "none",
          duration: 2000
        })
        wx.navigateTo({
          url: '/orderDetails/allOrders/allOrders?index=' + 0,
        })
      }
      
    })
  },
  // 通过订单ID 获取支付凭证 拉取支付
  getWXPayVoucher(orderId) {
    let params = {
      url: 'order/prepay',
      data: {
        orderId: orderId,
        shareCode: this.data.shareCode,
        // code: wx.getStorageSync('code')
      },
      method: 'POST'
    }
    common.request(params).then(res => {

      let data = res.data
      wx.requestPayment({
        timeStamp: data.timeStamp.toString(),
        nonceStr: data.nonceStr,
        package: data.packageValue,
        signType: data.signType,
        paySign: data.paySign,
        success(res) {
          wx.showToast({
            title: "支付成功",
            icon: "none",
            duration: 2000
          })
          // wx.switchTab({
          //   url: '/pages/myInfo/myInfo',
          // })
          wx.navigateTo({
            url: '/orderDetails/allOrders/allOrders?index=' + 0,
          })
        },
        fail(res) {
          wx.navigateTo({
            url: '/orderDetails/allOrders/allOrders?index=' + 1,
          })
          // wx.switchTab({
          //   url: "/pages/mine/mine",
          // })
        }
      })

    })
  },
  // 获取订单信息
  getInfo() {

    let params = {
      url: 'cart/checkout',
      data: {
        cartId: this.data.cartId,
        addressId: this.data.address.id ? this.data.address.id : '',
        couponId: this.data.coupon.id ? this.data.coupon.id : '',
        legumeFlag: this.data.isLD
      },
      method: 'GET'
    }
    common.request(params).then(res => {
      let data = res.data
      data.checkedGoodsList.map(item => {
        item.txt = item.specifications.join('、')
      })
      let prepayFlag = data.prepayFlag
      this.setData({
        data,
        prepayFlag
      })
    })
  }
})