import common from '../../utils/common.js'
Page({
  data: {
    vipLevel: [],
    orderId: '',
    params: {
      code: '',
      gradeId: ''
    },
    hotList: [],
  },
//  点击滚动到具体位置
  handleBtnClick() {
    wx.pageScrollTo({
      scrollTop: 400,
      duration: 1000
    })
  },
  
  // 获取会员等级
  getVipLevel() {
    let params = {
      url: 'level/grade',
      method: 'GET'
    }
    common.request(params).then(res => {
      console.log(res)
      let vipLevel = res
      let curMember = res.LitemallLevelGrade[0]
      vipLevel.expireTime = vipLevel.expireTime ? (vipLevel.expireTime.split(' '))[0] : ''
      this.setData({
        vipLevel,
        curMember
      })
    })
  },
  // 开通按钮
  handleBtnVip() {
    wx.setStorageSync('curMember', this.data.curMember)
    wx.navigateTo({
      url: '/my/hycz/hycz?time=' + this.data.vipLevel.expireTime,
    })
    // this.data.params.gradeId = this.data.curMember.id
    // this.vip()
  },
  // 选中会员
  openVip(e) {
    let curMember = e.currentTarget.dataset.item
    this.setData({
      curMember
    })
    // this.data.params.gradeId = e.currentTarget.dataset.gradecode
    // this.vip()
  },
  vip() {
    // 获取code
    wx.login({
      success: (res) => {
        console.log(res)
        this.data.params.code = res.code
        let contentType = "application/x-www-form-urlencoded"
        let params = {
          url: 'level/prepay',
          method: 'POST',
          data: this.data.params,
          contentType: contentType
        }
        common.request(params).then(res => {
          let data = res.data
          console.log(res)
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
              this.getVipLevel()
              // wx.switchTab({
              //   url: "/pages/mine/mine",
              // })
            },
            fail(res) {
              console.log(res, '支付失败')
              // wx.switchTab({
              //   url: "/pages/mine/mine",
              // })
            }
          })
          // this.data.orderId = res.data.orderId
          // this.setData({
          //   orderId: data.orderId,
          // })
        })
      }
    })
  },

    
  // // 首页渲染数据
  // getData() {
  //   let params = {
  //     url: '/home/index',
  //     method: 'GET'
  //   }
  //   common.request(params).then(res => {
  //     console.log(res,'134723472647')
  //     let data = res.data
  //     this.setData({
  //       hotList: data.hotGoodsList
  //     })
  //   })
  // },
  toProductDetails(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' +id,
    })
  },

  onShow(opt){
    this.getVipLevel()
  },
  onShareAppMessage() {
    return {
      title: '优心贝·母婴精选',
      path: "",
      imageUrl: '../../static/images/fxt.png'
    }
  },
})