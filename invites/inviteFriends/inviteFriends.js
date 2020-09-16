import common from '../../utils/common.js'

Page({

  data: {
    inviteCode: {}
  },
  // 获取邀请码
  getInviteCode() {
    let params = {
      url: 'user/code',
      method: 'get',
    }
    common.request(params).then(res => {
      console.log(res)
      this.setData({
        inviteCode: res.data
      })
    })
  },
  onLoad(opt) {
    this.getInviteCode()
  },
  onShareAppMessage() {
    
  }
})