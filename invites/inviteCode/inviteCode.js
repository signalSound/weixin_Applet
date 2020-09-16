import common from '../../utils/common.js'
Page({

  data: {
    invitationCode: '',
    show: 0,
    istx: true
  },
  onLoad(opt) {
    console.log(opt, '参数')
    let invitationCode = opt.scene ? decodeURIComponent(opt.scene) : ''
    this.setData({
      invitationCode,
      show: invitationCode ? 1 : 0
    })
    this.getFcode()
  },
  ytx() {
    wx.showToast({
      title: '您已填写',
      icon: 'none'
    })
  },
  // 获取邀请码
  handleCode(e) {
    this.data.invitationCode = e.detail.value;
    this.data.show = this.data.invitationCode? 1 : 0
    console.log('this.data.invitationCode', this.data.show )
    this.setData({
      inviteCode: this.data.invitationCode,
      show: this.data.show
    })
  },
  // 确定
  comfirmBtn() {
    let contentType = "application/x-www-form-urlencoded"
    let params = {
      url: 'user/addInvitation',
      method: 'post',
      data: {invitationCode:this.data.invitationCode},
      contentType : contentType
    }
    common.request(params).then(res => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    })
  },
  // 跳过按钮
  skipOverBtn() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getFcode() {
    let params = {
      url: 'user/getFcode',
      method: 'get'
    }
    common.request(params).then(res => {
      console.log(res.data)
      let istx = res.data ? true : false
      this.setData({
        istx
      })
    })
  },

})