import common from '../../utils/common.js'
Page({
  data: {
    params: {
      page: '1',
      limit: '10',
      sort: 'add_time',
      order: 'desc'
    },
    dataList: [],
    total: 0

  },
  onLoad(opt) {
    this.getData()
  },
  // 获取数据
  getData() {
    let params = {
      url: 'legumeDetail/list',
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
  // 触底加载
  onReachBottom() {
    if (this.data.total == this.data.dataList.length) return
    let params = this.data.params
    params.page = params.page + 1
    this.setData({
      params
    })
    this.getData();
  },

})