import common from '../../utils/common.js'
Page({
  data: {
    isShow: true,
    isSelect: false,
    last_time: '',
    is_show: true,
    countdown: 60,
    params: {
      code: '',
      mobile: '',
      type: '0'
    },
    winParams: {
      code: '',
      userInfo: ''
    }
  },
  onLoad(opt) {
    // console.log(opt)
    // wx.showToast({
    //   title: opt.decodeURIComponent,
    //   icon: 'none'
    // })
    let decodeURIComponent = opt.decodeURIComponent ? opt.decodeURIComponent : ''
    this.setData({
      decodeURIComponent
    })
  },
  // 跳转到用户协议
  toyhxy() {
    wx.navigateTo({
      url: '/my/fwxy/fwxy',
    })
  },
  // var countdown = 60;
  settime(that) {
    if (this.data.countdown == 0) {
      that.setData({
        is_show: true
      })
      this.data.countdown = 60;
      return;
    } else {
      that.setData({
        is_show: false,
        last_time: this.data.countdown
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
      url: '/auth/regCaptcha',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      that.setData({
        is_show: (!that.data.is_show) //false
      })
      that.settime(that);
  
      // let token = res.data.token
      // let userInfo = res.data.userInfo
      // wx.setStorageSync('token', token)
      // wx.setStorageSync('userInfo', userInfo)
      // wx.removeStorageSync('address')
      // wx.switchTab({
      //   url: '/pages/index/index',
      // })
    })
  },
  // 勾選用戶協議
  selectBtn() {
    this.data.isSelect = !this.data.isSelect
    this.setData({
      isSelect: this.data.isSelect
    })
  },
  // 获取手机号
  handleTel(e) {
    this.data.params.username = e.detail.value;
    this.data.params.mobile = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },

  // 获取验证码
  handleCode(e) {
    this.data.params.mobileCode = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  // 获取密码
  handlePsd(e) {
    this.data.params.password = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  // 点击tab
  loginTab(e) {
    let isShow = e.currentTarget.dataset['index']
    this.setData({
      isShow
    })
  },
  forgetBtnPass() {
    wx.navigateTo({
      url: '/login/modifyPass/modifyPass',
    })
  },
  // 手机快捷登录
  loginMobile() {
    wx.login({
      success: (res) => {
       
        this.data.params.code = res.code
        this.data.params.invitationCode = this.data.decodeURIComponent
        wx.setStorageSync('code', res.code)
        console.log(this.data.params, '登陆值')
        let params = {
          url: 'auth/mobile_login',
          method: 'post',
          data: this.data.params
        }
        common.request(params).then(res => {
         
          let token = res.data.token
          let userInfo = res.data.userInfo
          wx.setStorageSync('token', token)
          wx.setStorageSync('userInfo', userInfo)
          wx.removeStorageSync('address')
          // wx.switchTab({
          //   url: '/pages/index/index',
          // })
          wx.navigateBack()
        })
      }
    })
  },
  // 账号密码登录
  loginPassword() {
    wx.login({
      success: (res) => {

        this.data.params.code = res.code
        this.data.params.invitationCode = this.data.decodeURIComponent
        wx.setStorageSync('code', res.code)
        let params = {
          url: 'auth/login',
          method: 'post',
          data: this.data.params
        }
        common.request(params).then(res => {
        
          let token = res.data.token
          let userInfo = res.data.userInfo
          wx.setStorageSync('token', token)
          wx.setStorageSync('userInfo', userInfo)
          wx.removeStorageSync('address')
          // wx.switchTab({
          //   url: '/pages/index/index',
          // })
          wx.navigateBack()
        })
      }
    })
  },
  // 登录
  loginBtn() {
    if (this.data.isSelect) {
      if (this.data.isShow) {
        this.data.mobile
        this.loginMobile()
      } else {
        this.loginPassword()
      }
    } else {
      wx.showToast({
        title: '请先阅读协议',
        icon: 'none'
      })
    }
  },

  // 獲取用戶信息
  getUserInfo(e) {
    let userInfo = e.detail.userInfo
   
    this.loginWeixin(userInfo)
  },
  // 微信登录
  loginWeixin(users) {
    if (this.data.isSelect) {
      this.data.winParams.userInfo = users
      wx.login({
        success: (res) => {
          this.data.winParams.code = res.code
          this.data.winParams.invitationCode = this.data.decodeURIComponent
          console.log(this.data, '登陆值')
          let contentType = "application/x-www-form-urlencoded"
          let params = {
            url: 'auth/login_by_weixin',
            method: 'post',
            data: this.data.winParams,
            // contentType : contentType  
          }
          common.request(params).then(res => {
           
            wx.showToast({
              title: '成功登录',
              icon: 'none'
            })
            let token = res.data.token
            let userInfo = res.data.userInfo
            wx.setStorageSync('token', token)
            wx.setStorageSync('userInfo', userInfo)
            // wx.switchTab({
            //   url: '/pages/index/index',
            // })
            wx.navigateBack()
          })
        },
        fail(res) {}
      })
    } else {
      wx.showToast({
        title: '请先阅读协议',
        icon: 'none'
      })
    }
  },
})