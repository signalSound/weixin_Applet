import common from '../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      page: '1',
      limit: '10',
      sort: 'add_time',
      order: 'desc'
    },
    beanLists: [],
    vipLevel: [],
  },
  onLoad(opt) {
    this.getBean()
    this.getVipLevel()
  },
  // 首页渲染数据
  getBean() {
    let params = {
      url: 'withDrawal/list',
      method: 'GET',
      data: this.data.params
    }
    common.request(params).then(res => {
      console.log(res)
      let data = res.data
      data.expireTime = data.expireTime ? (data.expireTime.split(' '))[0] : ''
      this.setData({
        beanLists: data
      })
    })
  },
  toMybean() {
    wx.navigateTo({
      url: '/wallets/myBean/myBean',
    })
  },
  handleBtnClick() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  bugVip() {
    wx.switchTab({
      url: '/pages/vip/vip',
    })
  },
  benRecord() {
    wx.navigateTo({
      url: '/wallets/beanDetails/beanDetails',
    })
  },
  // 获取会员等级
  getVipLevel() {
    let params = {
      url: '/level/grade',
      method: 'GET'
    }
    common.request(params).then(res => {
      console.log(res)
      let vipLevel = res
      let curMember = res.LitemallLevelGrade[0]
      this.setData({
        vipLevel,
        curMember
      })
    })
  },

  // 开通会员
  openVip(e) {
    console.log(e, 2222222222222)

    let curMember = e.currentTarget.dataset.item
    this.setData({
      curMember
    })
    // this.vip()
  },
  handleBtn() {
    wx.navigateTo({
      url: '/my/dailyTasks/dailyTasks',
    })
  },
  vip() {
    // 获取code
    wx.login({
      success: (res) => {
        console.log(res)
        this.data.params.code = res.code
        let contentType = "application/x-www-form-urlencoded"
        let params = {
          url: 'level/updateLegume',
          method: 'POST',
          data: this.data.params,
          contentType: contentType
        }
        common.request(params).then(res => {
          wx.showToast({
            title: "支付成功",
            icon: "none",
            duration: 2000
          })
          this.getBean()
        })
      }
    })
  },

  // 开通按钮
  handleBtnVip(e) {
    this.data.params.gradeId = this.data.curMember.id
    this.vip()
  },
  toProductDetails(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' + id,
    })
  },


})