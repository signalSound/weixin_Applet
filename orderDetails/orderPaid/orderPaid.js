import common from '../../utils/common.js'
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetails: {},
    isLD: true,
    txt: ''
  },
  // toPaidPage() {
  //   wx.navigateTo({
  //     url: '/orderDetails/fillOrder/fillOrder',
  //   })
  // },
  // 跳转到商品详情
  toProductDetails(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' +id,
    })
  },
  // 获取商品详情
  getOrderDetails(id) {
    let params = {
      url: '/order/detail',
      method: 'get',
      data: {
        'orderId': id
      }
    }
    common.request(params).then(res => {
      console.log(res)
      let orderDetails = res.data

      let timestamp = (Date.parse(new Date())) / 1000;
      let curTime = orderDetails.orderInfo.addTime
      curTime =  curTime.replace(/-/g,'/')
      curTime = (Date.parse(new Date(curTime))) / 1000
      let time1 = timestamp - curTime
      let txt = ''
      console.log(time1)
      if (time1 <= 900 && orderDetails.orderInfo.handleOption.pay === true) {
        let time = 900 - time1
        timer = setInterval(() => {
          time--;
          txt = common.secondsFormat(time);
          if (time < 1) {
            clearInterval(timer)
            this.getOrderDetails(orderDetails.orderInfo.id)
            return
          }
          this.setData({
            txt
          })
        }, 1000)
      }


      this.setData({
        orderDetails: orderDetails
      })
    })
  },
  handleLD() {
    let isLD = this.data.isLD
    isLD = !isLD
    this.setData({
      isLD
    })
    this.getInfo()
  },
  // 确认订单
  confirmBtn(e) {
    let orderId = e.currentTarget.dataset.id
    let params = {
      url: 'order/confirm',
      method: 'post',
      data: {
        'orderId': orderId
      }
    }
    common.request(params).then(res => {
    
      this.getOrderDetails(orderId)
      wx.showToast({
        title: '确认成功',
        icon: 'none'
      })
    })
  },
  // 取消订单
  CancelBtn(e) {
    let orderId = e.currentTarget.dataset.id
    let params = {
      url: '/order/cancel',
      method: 'post',
      data: {
        'orderId': orderId
      }
    }
    common.request(params).then(res => {
      this.getOrderDetails(orderId)
      wx.showToast({
        title: '取消成功',
        icon: 'none'
      })
    })
  },
  // 复制订单编号
  copy(e) {
    console.log(e)
    let copyText = e.currentTarget.dataset.ordersn
    console.log(copyText, 12343)
    wx.setClipboardData({
      data: copyText,
      success: (res) => {}
    })
  },
  // 通过订单ID 获取支付凭证 拉取支付
  getWXPayVoucher(e) {
    let orderId = e.currentTarget.dataset.id
    let params = {
      url: 'order/prepay',
      data: {
        orderId: orderId,
        // code: wx.getStorageSync('code')
      },
      method: 'POST'
    }
    common.request(params).then(res => {
      console.log(res)
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
          wx.navigateBack()
        },
        fail(res) {
          // wx.switchTab({
          //   url: "/pages/mine/mine",
          // })
        }
      })
    })
  },
  onLoad: function (options) {
    clearInterval(timer)
    this.getOrderDetails(options.orderId)
  },
  onShow: function () {
    clearInterval(timer)
  },

  onHide: function () {
    clearInterval(timer)
  },

  onUnload: function () {
    clearInterval(timer)
  },
})