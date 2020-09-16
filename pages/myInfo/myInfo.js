import common from '../../utils/common.js'
Page({

  data: {
    vipLevel: {},
    params: {
      page: '1',
      limit: '10',
      sort: 'add_time',
      order: 'desc'
    },
    beanLists: [],
    arr: [{
        column_goods_list: 'VIP会员',
        text: '',
        id: 1
      },
      {
        column_goods_list: '我的乐豆',
        text: '余额0豆',
        id: 3
      }, {
        column_goods_list: '我的礼券',
        text: '拥有0张券',
        id: 4
      }
    ],
  },
  onShow() {
    this.getVipLevel()
  },
  // 绑定手机
  getPhoneNumber(e){
    if(e.detail.errMsg == 'getPhoneNumber:ok'){
      let params = {
        url: 'auth/bindPhone',
        method: 'POST',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        }
      }
      common.request(params).then(res => {
        cwx.showToast({
          title: '成功绑定',
          icon: 'none'
        })
      })
    }else{
      console.log(2)
    }
  },
  // 退出登录
  tcLogin() {
    wx.clearStorageSync()
    wx.navigateTo({
      url: '/login/loginPage/loginPage',
    })
  },
  toInvitePage() {
    wx.navigateTo({
      url: '/invites/inviteMoney/inviteMoney',
    })
  },
  fillInBtn() {
    wx.navigateTo({
      url: '/invites/inviteCode/inviteCode',
    })
  },

  toSetPage() {
    wx.navigateTo({
      url: '/my/mySet/mySet',
    })
  },

  toMyVoucher() {
    wx.navigateTo({
      url: '/my/myVoucher/myVoucher',
    })
  },
  toAddressList() {
    wx.navigateTo({
      url: '/orderDetails/addressList/addressList',
    })
  },
  toDailyTasks() {
    wx.navigateTo({
      url: '/my/dailyTasks/dailyTasks',
    })
  },
  toInvite() {
    wx.navigateTo({
      url: '/invites/inviteMoney/inviteMoney',
    })
  },
  toInvites() {
    console.log(111)
    wx.navigateTo({
      url: '/invites/inviteMoney/inviteMoney',
    })
  },
  vipPrivilege() {
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },
  // 点击头像事件
  toSign() {

  },
  inviteRecord() {
    wx.navigateTo({
      url: '/invites/inviteRecord/inviteRecord',
    })
  },
  toOrders(e) {
    console.log(e)
    wx.navigateTo({
      url: '/orderDetails/allOrders/allOrders?index=' + e.currentTarget.dataset.index,
    })
  },
  // 点击跳转
  toProductDetails(e) {
    console.log('index', e)
    let index = e.currentTarget.dataset.data.id
    if (index === 1) {
      wx.switchTab({
        url: '/pages/vip/vip',
      })
      return false
    }
    if (index === 3) {
      wx.navigateTo({
        url: '/wallets/beanHome/beanHome',
      })
      return false
    }
    if (index === 4) {
      wx.navigateTo({
        url: '/my/myVoucher/myVoucher',
      })
      return false
    }

  },
  // 首页渲染数据
  getBean() {
    let params = {
      url: 'withDrawal/list',
      method: 'GET',
      data: this.data.params
    }
    common.request(params).then(res => {
      console.log(res)
      let data = res.data
      data.legume = data.legume >= 1000 ? (data.legume/1000).toFixed(2) + '千' : data.legume
      this.data.arr[1].text = '余额' + data.legume + '豆'
      this.setData({
        arr: this.data.arr,
      })
    })
  },
  // 获取会员等级
  getVipLevel() {
    let params = {
      url: '/level/grade',
      method: 'GET'
    }
    common.request(params).then(res => {
      this.getBean()
      this.getCouponList()
      let vipLevel = res
      this.data.arr[0].text = '首月' + res.LitemallLevelGrade[0].gradePrice + '元'
      this.setData({
        vipLevel,
        arr: this.data.arr
      })
    })
  },
  // 获取优惠券
  getCouponList() {
    let params = {
      
      url: 'coupon/mylist',
      data: {
        limit: 10,
        status: 0,
        sort: add_time,
        page: 1,
        order: desc,
      },
      method: 'get'
    }
    common.request(params).then(res => {
      let arr = this.data.arr
      arr[2].text = '拥有' + res.data.total + '张券'
      this.setData({
        arr
      })
    })
  },
  // 格式化时间
  timeToStr(v) {
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
  signBtn() {
    wx.navigateTo({
      url: '/my/dailyTasks/dailyTasks',
    })
    // let time =  this.timeToStr(new Date().valueOf())
    // let contentType = "application/x-www-form-urlencoded"

    // let params = {
    //   url: 'sign/add',
    //   method: 'POST',
    //   data: {addDate: time },
    //   contentType : contentType
    // }
    // common.request(params).then(res => {
    //   wx.showToast({
    //     title: "签到成功",
    //     icon: "none",
    //     duration: 2000
    //   })
    // })
  },

  onShareAppMessage() {
    return {
      title: '优心贝·母婴精选',
      path: "",
      imageUrl: '../../static/images/fxt.png'
    }
  },
})