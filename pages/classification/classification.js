import common from '../../utils/common.js'
Page({
  data: {
    params: {
      page: 1,
      limit: 10,
      categoryId: ''
    },
    total: 0,
    dataList: [],
    name: '', // 分类名
  },
  onLoad(opt) {
    let id = opt.id
    let name = opt.name
    let params = this.data.params
    params.categoryId = id
    this.setData({
      params,
      name
    })
    this.getList()
  },
  // 跳转到商品详情
  toProductDetails(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' +id,
    })
  },
  // 获取商品列表
  getList() {
    let params = {
      url: 'goods/list',
      method: 'GET',
      data: this.data.params
    }
    common.request(params).then(res => {
      let dataList = [...this.data.dataList, ...res.data.list]
      this.setData({
        dataList,
        total: res.data.total
      })
    })
  },
  onReachBottom() {
    if (this.data.total == this.data.dataList.length) return
    let params = this.data.params
    params.page = params.page + 1
    this.setData({
      params
    })
    this.getList();
  },
})