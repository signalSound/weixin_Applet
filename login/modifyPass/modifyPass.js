import common from '../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {},
    last_time:'',
    is_show:true,
    countdown: 60,
  },
  // 获取手机号
  handleMobile(e) {
    this.data.params.mobile = e.detail.value
    this.setData({
      params: this.data.params
    })
  },

  // 获取登录密码
  handlePass(e) {
    this.data.params.password = e.detail.value
    this.setData({
      params: this.data.params
    })
  },

  // 获取验证码
  handleCode(e) {
    this.data.params.code = e.detail.value
    this.setData({
      params: this.data.params
    })
  },
  // 修改登录密码
  modifyPassBtn() {
    let params = {
      url: 'auth/reset',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      // 回退
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
      wx.navigateBack({
        delta: 1
      })
      console.log('res', res)
      // wx.switchTab({
      //   url: '/pages/index/index',
      // })
    })
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
  clickVerify() {
    let that = this
    // 将获取验证码按钮隐藏60s，60s后再次显示
    let params = {
      url: '/auth/captcha',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      console.log(res, 'dadsadsa')
      let token = res.data.token
      let userInfo = res.data.userInfo
      wx.setStorageSync('token', token)
      wx.setStorageSync('userInfo', userInfo)
      wx.removeStorageSync('address')
      wx.switchTab({
        url: '/pages/index/index',
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