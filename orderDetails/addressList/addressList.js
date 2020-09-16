import common from '../../utils/common.js'
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo')
  },
  onLoad (opt){
    let type = opt.type
    this.setData({
      type
    })
    // console.log(this.data.userInfo)
  },
  onShow(){
    this.getAddressList()
  },
  // 选择地址
  selectAddress(e) {
    let address = e.currentTarget.dataset.data;
    wx.setStorageSync('address', address)
    wx.navigateBack();
  },
  // 添加地址
  addAdress() {
    wx.navigateTo({
      url: '/orderDetails/addAddress/addAddress?type=' + '0',
    })
  },
  // 获取地址列表
  getAddressList() {
    let params = {
      url: 'address/list',
      method: 'get',
      data: {'userId':'1'}
    }
    common.request(params).then(res => {
      let addressList = res.data.list
      this.setData({
        addressList
      })
    })
  },
  // 设置默认地址
  setAddress(e) {
    let isDefault = e.currentTarget.dataset.isdefault.isDefault
    let id = e.currentTarget.dataset.isdefault.id
    console.log(e)
    isDefault =  isDefault ? false: true
    let contentType = "application/x-www-form-urlencoded"
    console.log(e,'设置默认地址')
    let params = {
      url: '/address/updateIsDefault',
      method: 'post',
      data: {isDefault: isDefault,'id':id},
      contentType : contentType

    }
    common.request(params).then(res => {
      this.getAddressList()
      wx.showToast({
        title: '设置默认',
        icon: 'none'
      })
    })
  },
  // 删除按钮
  delectBtn(e){
    console.log(e,'删除按钮')
    let id = e.currentTarget.dataset.delect.id
    let params = {
      url: '/address/delete',
      method: 'post',
      data: {'id':id}
    }
    common.request(params).then(res => {
      this.getAddressList()
      wx.showToast({
        title: '删除成功',
        icon: 'none'
      })
    })
  },
  // 编辑按钮
  editorBtn(e){
    let id = e.currentTarget.dataset.editor.id
    console.log(e)
    wx.navigateTo({
      url: '/orderDetails/addAddress/addAddress?editor=' + id,
    })
    // let params = {
    //   url: '/address/list',
    //   method: 'get',
    //   data: {'userId':'1'}
    // }
    // common.request(params).then(res => {
    //   this.addressList = res.data.list
    //   this.setData({
    //     addressList: this.addressList
    //   })
    // })
  },

})