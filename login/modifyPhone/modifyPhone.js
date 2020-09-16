import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {},
    last_time:'',
    is_show: true,
    countdown: 60,
    last_times:'',
    is_shows: true,
    countdowns: 60,
    oldParams: {
      mobile: '',
      type: '1'
    },
    newParams: {
      mobile: '',
      type: '2'
    }
  },
  settimes (that) {
    if (this.data.countdowns == 0) {
     that.setData({
      is_shows: true
     })
     this.data.countdowns = 60;
     return;
    } else {
     that.setData({
      is_shows:false,
      last_time:this.data.countdowns
     })
    
     this.data.countdowns--;
    }
    setTimeout(function () {
     that.settimes(that)
    }, 1000)
   },
  settime (that) {
    if (this.data.countdown == 0) {
     that.setData({
      is_show: true
     })
     this.data.countdown = 60;
     return;
    } else {
     that.setData({
      is_show:false,
      last_time:this.data.countdown
     })
    
     this.data.countdown--;
    }
    setTimeout(function () {
     that.settime(that)
    }, 1000)
   },
  // 获取手机号
  handlePhone(e) {
    this.data.params.phone = e.detail.value;
    this.data.oldParams.phone = e.detail.value
    this.setData({
      params: this.data.params
    })
  },

   // 获取手机号
   handlePhoneCode(e) {
    this.data.params.phoneCode = e.detail.value;
    this.data.newParams.phone = e.detail.value
    this.setData({
      params: this.data.params
    })
  },

   // 获取手机号
   handleMobile(e) {
    this.data.params.mobile = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
   // 获取手机号
   handleCode(e) {
    this.data.params.code = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  modifityMobile () {
    let params = {
      url: '/auth/resetPhone',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
      console.log(res, 'dadsadsa')
    })
  },
  clickVerifys(){
    let that = this
    // 将获取验证码按钮隐藏60s，60s后再次显示
    let params = {
      url: '/auth/captcha',
      method: 'post',
      data: this.data.newParams
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '获取成功',
        icon: 'none'
      })
    })

      that.setData({
       is_show: (!that.data.is_shows)  //false
      })
      that.settimes(that);
  },
  clickVerify() {
    let that = this
    // 将获取验证码按钮隐藏60s，60s后再次显示
    let params = {
      url: '/auth/captcha',
      method: 'post',
      data: this.data.oldParams
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '获取成功',
        icon: 'none'
      })
    })

      that.setData({
       is_show: (!that.data.is_show)  //false
      })
      that.settime(that);
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

 

})