import common from '../../utils/common.js'
Page({

  data: {

  },
  // 绑定手机
  getPhoneNumber(e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
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
    } else {
      console.log(2)
    }
  },
  toPhone() {
    wx.navigateTo({
      url: '/login/modifyPhone/modifyPhone',
    })
  },
  toPassword() {
    wx.navigateTo({
      url: '/login/modifyPass/modifyPass',
    })
  },

})