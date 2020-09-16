import common from '../../utils/common.js'

Page({
  data: {
    params: {
      limit: '10',
      status: "0",
      sort: 'add_time',
      page: '1',
      order: 'desc'
    },
    total: 0,
    couponList: [],

    type: ''
  },
  onLoad (opt){
    this.setData({
      type: opt.type ? opt.type : ''
    })
    this.getCouponList()
  },
  // 选中优惠券
  select(e) {
    console.log(e)
    let coupon = e.currentTarget.dataset.item;
    wx.setStorageSync('coupon', coupon)
    wx.navigateBack();
  },
  handleBtnClick () {
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },
  // 获取优惠劵
  getCouponList() {
    let params = {
      url: 'coupon/mylist',
      method: 'get',
      data: this.data.params
    }
    common.request(params).then(res => {
      console.log(res)
      this.data.couponList =[ ...this.data.couponList,...res.data.list]
      this.setData({
        couponList: this.data.couponList,
        total: res.data.total
      })
    })
  },
  // 触底加载
  onReachBottom() {
    if (this.data.total == this.data.couponList.length) return
    let params = this.data.params
    params.page = params.page + 1
    this.setData({
      params
    })
    this.getCouponList();
  }
})