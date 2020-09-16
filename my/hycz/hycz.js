import common from '../../utils/common.js'
Page({
  data: {
    time:'',
    data: {},
    curMember: {},
    coupon: {},
  },
  onLoad (opt){
    let time = opt.time
    this.setData({
      time,
      curMember: wx.getStorageSync('curMember')
    })
    // let time = (Date.parse(new Date())) / 1000
    // let timeStr = common.timeToStr(time)
    // console.log(timeStr)
  },
  onShow (){
    let coupon = {}
    if(wx.getStorageSync('coupon')) {
      coupon = wx.getStorageSync('coupon')
      wx.removeStorageSync('coupon')
    }
    this.setData({
      coupon
    })
  },
  // 跳转到会员协议
  tohyxy() {
    wx.navigateTo({
      url: '/my/hyxy/hyxy',
    })
  },
  // 跳转到我的优惠券
  toMyVoucher() {
    wx.navigateTo({
      url: '/my/myVoucher/myVoucher?type=1',
    })
  },
  open() {
    let data = {}
    // 获取code
    wx.login({
      success: (res) => {
        data.code = res.code
        data.gradeId = this.data.curMember.id
        data.couponUserId = this.data.coupon.id ? this.data.coupon.id : ''
        let contentType = "application/x-www-form-urlencoded"
        let params = {
          url: 'level/prepay',
          method: 'POST',
          data: data,
          contentType: contentType
        }
        common.request(params).then(res => {
          let data = res.data
          // 拉起微信支付
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
              setTimeout(() => {
                wx.navigateBack()
              }, 2000);
            },
            fail(res) {
              console.log(res, '支付失败')
            }
          })
        })
      }
    })
  },
  
})