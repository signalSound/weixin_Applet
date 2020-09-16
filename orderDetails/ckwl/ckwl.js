import common from '../../utils/common.js'
Page({
  data: {
    data: {},
  },
  onLoad(opt) {
    console.log(opt.id)
    this.getData(opt.id)
  },
  getData(id) {
    let contentType = "application/x-www-form-urlencoded"
    let params = {
      url: 'order/expressInfo',
      method: 'post',
      data: {
        orderId: id,
      },
      contentType: contentType
    }
    common.request(params).then(res => {
      console.log(res)
      let data = res.data.expressInfo
      this.setData({
        data
      })
    })
  },
})