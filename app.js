import common from './utils/common.js'
App({
  onLaunch() {
    wx.removeStorageSync('address')
    this.globalData.userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo') : {} 
    this.globalData.isLogin = wx.getStorageSync('userInfo') ? true : false
  },
  globalData: {
    userInfo: {},
    isLogin: false
  }
})

// wx.setStorageSync('member_recommend_id', member_recommend_id)
// wx.getStorageSync('userId')
// wx.removeStorageSync('car_fresh')