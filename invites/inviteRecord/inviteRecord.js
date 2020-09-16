import common from '../../utils/common.js'

Page({

  data: {
    inviteRecord: []
  },

  // 获取邀请码
  getInviteCode() {
    let params = {
      url: 'user/invitationList',
      method: 'get',
    }
    common.request(params).then(res => {
      this.setData({
        inviteRecord: res.data
      })
    })
  },
  onLoad(opt) {
    this.getInviteCode()
  },
  onReachBottom() {

  },
})