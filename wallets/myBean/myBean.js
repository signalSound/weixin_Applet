import common from '../../utils/common.js'
Page({
  data: {
    beanLists: [],
    isShow: false,
    params: {
      outMode: 'zfb'
    }
  },
  // 获取乐豆值
  handleNum(e) {
    this.data.params.outLegume = e.detail.value ? e.detail.value : 0;
    this.setData({
      params: this.data.params
    })
  },
  // 获取姓名
  handleName(e) {
    this.data.params.name = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  // 账号
  handleAccount(e) {
    this.data.params.outNumber = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  // 手机
  handleTel(e) {
    this.data.params.phone = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  // 提交
  save() {
    // this.data.params.outLegume = this.data.beanLists.legume
    let params = {
      url: 'withDrawal/add',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '成功提现',
        icon: 'none'
      })
      this.hidden()
      this.getBean()
    })

  },
  // 隐藏贪嗔痴
  hidden() {
    this.setData({
      isShow: false
    })
  },
  // 首页渲染数据
  getBean() {
    let data = {
      page: '1',
      limit: '10',
      sort: 'add_time',
      order: 'desc',
      isShow: true,
    }
    let params = {
      url: 'withDrawal/list',
      method: 'GET',
      data: data
    }
    common.request(params).then(res => {
      let data = res.data
      this.data.params.outLegume = data.legume
      data.expireTime = data.expireTime ? (data.expireTime.split(' '))[0] : ''
      this.setData({
        beanLists: data,
        params: this.data.params
      })
    })
  },
  showTX() {
    this.setData({
      isShow: true
    })
  },
  onLoad() {
    this.getBean()
  },
})