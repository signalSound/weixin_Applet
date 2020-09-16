import common from '../../utils/common.js'
let timer = null
Page({
  data: {
    params: {
      limit: '10',
      showType: "0",
      sort: 'add_time',
      page: '1',
      order: 'desc',
      keyWord: ''
    },
    index: '0',
    orderList: [],
    total: 0,

    prepayFlag: true
  },
  onLoad(opt) {
    console.log(opt)
    clearInterval(timer)
    let index = opt.index ? opt.index : '0'
    this.data.params.showType = index
    this.setData({
      index: index
    })
  },
  onShow() {
    let params = this.data.params
    params.page = 1
    this.setData({
      params,
      orderList: [],
      total: 0
    })
    this.getOrderList()
  },
  // 跳转到查看物流
  tockwl(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/orderDetails/ckwl/ckwl?id=' + id,
    })
  },
  // 跳转到退款原因
  toTxyy(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/orderDetails/tkyy/tkyy?id=' + id,
    })
  },
  handleBtnAll(e) {
    let index = e.currentTarget.dataset.index
    this.data.params.showType = index
    this.data.params.page = 1
    this.setData({
      index: index
    })
    this.data.orderList = []
    this.getOrderList()
  },

  // 确定搜索
  handleSearch(e) {
    let params = this.data.params
    params.keyWord = e.detail.value ? e.detail.value : this.data.params.keyWord
    params.page = 1

    this.setData({
      params,
      orderList: []
    })
    this.getOrderList()
  },
  // 搜索框赋值  当值为 '' 时 触发搜索
  handleVal(e) {
    let params = this.data.params
    params.keyWord = e.detail.value
    this.setData({
      params
    })
    if (e.detail.value != '') return
    params.page = 1
    this.setData({
      params,
      orderList: []
    })
    this.getOrderList()
  },
  // 获取订单列表
  getOrderList() {
    let params = {
      url: '/order/list',
      method: 'get',
      data: this.data.params
    }
    common.request(params).then(res => {
      let orderList = [...this.data.orderList, ...res.data.list]

      this.setData({
        orderList,
        total: res.data.total
      })
    })
  },
  // 跳转到订单详情
  toOrderDetail(e) {
    let orderId = e.currentTarget.dataset.data.id
    wx.navigateTo({
      url: '/orderDetails/orderPaid/orderPaid?orderId=' + orderId + '',
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

      wx.showToast({
        title: '取消成功',
        icon: 'none'
      })
      this.data.params.page = 1
      this.setData({
        params: this.data.params,
        orderList: []
      })
      this.getOrderList()
    })
  },
  piadBtn(e) {
      let orderId = e.currentTarget.dataset.id
      let params = {
        url: 'order/prepay',
        data: {
          orderId: orderId,
        },
        method: 'POST'
      }
      common.request(params).then(res => {
        let that = this
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
            that.data.params.showType = 2
            that.data.params.page = 1
            that.setData({
              index: '2'
            })
            that.data.orderList = []
            that.getOrderList()
            
          },
          fail(res) {
          }
        })
      })
  },
  // 确认订单
  conformBtn(e) {
    let orderId = e.currentTarget.dataset.id
    let params = {
      url: 'order/confirm',
      method: 'post',
      data: {
        'orderId': orderId
      }
    }
    common.request(params).then(res => {

      wx.showToast({
        title: '确认成功',
        icon: 'none'
      })
      this.data.params.page = 1
      this.setData({
        params: this.data.params,
        orderList: []
      })
      this.getOrderList()
    })
  },
  // 复制订单编号
  copy(e) {
    let copyText = e.currentTarget.dataset.ordersn
    wx.setClipboardData({
      data: copyText,
      success: (res) => {}
    })
  },

  // 触底加载
  onReachBottom() {
    if (this.data.total == this.data.orderList.length) return
    let params = this.data.params
    params.page = params.page + 1
    this.setData({
      params
    })
    clearInterval(timer)
    this.getOrderList();
  },



})