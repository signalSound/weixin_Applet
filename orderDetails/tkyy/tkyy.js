import common from '../../utils/common.js'
Page({
  data: {
    params: {
      remark: ''
    }
  },
  onLoad(opt) {
    let params = this.data.params
    params.orderId = opt.id ? opt.id : ''
  },
  // 获取退款原因
  handleReason(e) {
    this.data.params.refundContent = e.detail.value;
    this.setData({
      params: this.data.params
    })
  },
  save() {
    let params = {
      url: 'order/refund',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '申请成功',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000);
    })
  },
  
})