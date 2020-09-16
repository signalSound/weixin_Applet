import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      limit: '10',
      status: "0",
      sort: 'add_time',
      page: '1',
      order: 'desc'
    },
    arr: [1,2,3,4,5,6,7],
    total: 0,
    couponList: [],
    taskList: []
  },

   // 获取优惠劵
   getCouponLists() {
    let params = {
      url: '/sign/list',
      method: 'get',
      // data: this.data.params
    }
    common.request(params).then(res => {
      console.log(res,11111111111)
      this.data.couponList = res.data
      this.setData({
        couponList: this.data.couponList,
        total: res.data.total
      })
    })
  },

   // 获取每日任务列表
   getCouponList() {
    let params = {
      url: '/task/list',
      method: 'get',
      // data: this.data.params
    }
    common.request(params).then(res => {
      console.log(res,11111111111)
      this.data.taskList = res.data
      for (let index = 0; index < this.data.taskList.length; index++) {
        // this.data.taskList[index].status;
        this.data.taskList[index].statu = this.status(this.data.taskList[index].status)

        
      }
      // this.data.taskList.map(val=>{
      //   val.statu = this.status(val.status)
      //   return val
      // })
      console.log(this.data.taskList,22222222)
      this.setData({
        taskList: this.data.taskList
      })
    })
  },
  status(value) {
    if(value == '0') {
      return '去签到'
    }
    if(value == '1') {
      return '去消费'
    }
    if(value == '2') {
      return '去邀请'
    }
    // if(value == '3') {
    //   return '去提现'
    // }
    if(value == '4') {
      return '去提现'
    }
    if(value == '5') {
      return '去分享'
    }
    if(value == '6') {
      return '去邀请'
    }
  },
  taskBtn(e) {
    let statu = e.currentTarget.dataset.status;

    console.log(e,statu)
    if(statu == '0') {
      return  wx.switchTab({
        url: '/pages/myInfo/myInfo',
      })
    }
    if(statu == '1') {
      return  wx.switchTab({
        url: '/pages/index/index',
      })
    }
    if(statu == '2') {
      return  wx.navigateTo({
        url: '/invites/inviteMoney/inviteMoney',
      })
    }
    if(statu == '3') {
      return '/wallets/myBean/myBean'
    }
    if(statu == '4') {
      return  wx.switchTab({
        url: '/pages/vip/vip',
      })
    }
    if(statu == '5') {
      return  wx.switchTab({
        url: '/pages/index/index',
      })
    }
    if(statu == '6') {
      return  wx.switchTab({
        url: '/pages/vip/vip',
      })
    }
  },
  shareBtn() {
    wx.navigateTo({
      url: '/invites/inviteMoney/inviteMoney',
    })
  },
    // 触底加载
    // onReachBottom() {
    //   if (this.data.total == this.data.dataList.length) return
    //   let params = this.data.params
    //   params.page = params.page + 1
    //   this.setData({
    //     params
    //   })
    //   this.getOrderList();
    // },

      // 格式化时间
   timeToStr(v){
    let date = new Date(v),
    year = date.getFullYear(),
    mouth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
    hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
    minu = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
    sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return year + '-' + mouth + '-' + day
  },
  // 签到
  signBtn () {
    let time =  this.timeToStr(new Date().valueOf())
    let contentType = "application/x-www-form-urlencoded"

    let params = {
      url: 'sign/add',
      method: 'POST',
      data: {addDate: time },
      contentType : contentType
    }
    common.request(params).then(res => {
      this.getCouponLists()
      this.getCouponList()
      wx.showToast({
        title: "签到成功",
        icon: "none",
        duration: 2000
      })
    })
  },
  // 去提现
  exchangeBtn () {
    wx.navigateTo({
      url: '/wallets/myBean/myBean',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponLists()
    this.getCouponList()
  },

  
})