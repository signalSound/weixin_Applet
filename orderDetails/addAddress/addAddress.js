import common from '../../utils/common.js'
Page({

  data: {
    index: '',
    params: {
      id: '0',
      province: '',
      city: '',
      county: '',
      isDefault: false,
      postalCode: '',
      areaCode: ''
    }
  },
    // 获取手机号
    handleTel(e) {
      this.data.params.tel = e.detail.value;
      this.setData({
        params: this.data.params
      })
    },
    // 获取详细地址
    handleDetais(e) {
      this.data.params.addressDetail = e.detail.value;
      this.setData({
        params: this.data.params
      })
    },
    // 收获人
    handleName(e) {
      this.data.params.name = e.detail.value;
      this.setData({
        params: this.data.params
      })
    },
    // 选择地址
    bindRegionChange(e) {
      console.log(e)
      this.data.params.province = e.detail.value[0];
      this.data.params.city = e.detail.value[1];
      this.data.params.county = e.detail.value[2];
      // this.data.params.areaCode = e.detail.code.toString()
      this.data.params.areaCode = e.detail.code[2]
      this.data.params.postalCode = e.detail.postcode

      this.setData({
        params: this.data.params
      })
    },
  // 添加地址
  getAddressList() {
    let params = {
      url: '/address/save',
      method: 'post',
      data: this.data.params
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '保存成功',
        icon: 'none'
      })
      wx.navigateBack();
    })
  },
  // 获取地址详情
  getAddressDetails(id) {
    let params = {
      url: 'address/detail',
      method: 'GET',
      data: {'id': id}
    }
    common.request(params).then(res => {
      let addressDetails = res.data
      this.setData({
        params:addressDetails
      })
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    options.editor ? this.getAddressDetails(options.editor): ''
    console.log(options)
  },

})