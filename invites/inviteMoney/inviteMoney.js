import common from '../../utils/common.js'

Page({

  data: {
    inviteCode: {},
    openSettingBtnHidden: true
  },
  onShow(opt) {
    this.getInviteCode()
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
              this.setData({
                openSettingBtnHidden: false
              })
            }
          })
        }
      }
    })
  },
  // 授权
  handleSetting(e) {
    var that = this
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      that.setData({
        openSettingBtnHidden: true
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        openSettingBtnHidden: true
      })
    }
  },
  posterSave() {
    wx.getSetting({
      success: re => {
        console.log(re)
        if (!re.authSetting['scope.writePhotosAlbum']) {
          this.setData({
            openSettingBtnHidden: false
          })
          wx.showToast({
            title: '请先授权',
            icon: 'none',
          })
          wx.openSetting({})
        } else {
          console.log(this.data.inviteCode.invitationUrl)
          wx.getImageInfo({
            src: this.data.inviteCode.invitationUrl,
            success: res => {
              wx.saveImageToPhotosAlbum({
                filePath: res.path,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                  })
                },
                fail: function (err) {
                  console.log(err)
                  if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {

                  }
                }
              })
            }
          })
        }
      },
      fail(res) {
        console.log('调用失败')
      }
    })
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
  onShareAppMessage() {
    let scene = this.data.inviteCode.invitationCode ? this.data.inviteCode.invitationCode : ''
    console.log(scene)
    return {
      title: '优心贝·母婴精选',
      path: "/invites/inviteCode/inviteCode?scene="+scene+"",
      imageUrl: '../../static/images/fxt.png'
    }
  }
})