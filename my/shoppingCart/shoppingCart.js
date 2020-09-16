import common from '../../utils/common.js'
Page({
  data: {
    dataList: [],

    curItem: {}, // 当前操作的购物车商品

    idArr: [], // 选中的ID数组

    allCur: false, // 是否全部选中
    edit: false, // 是否编辑
    cartTotal: {}, // 商品价格
  },
  onShow() {
    this.getCartList()
  },
  toFillOrder() {
    wx.navigateTo({
      url: '/orderDetails/fillOrder/fillOrder?id=' + 0,
    })
  },
  handleEdit() {
    let edit = this.data.edit
    edit = !edit
    this.setData({
      edit
    })
  },

  //增加
  add(e) {
    let obj = e.currentTarget.dataset.item;
    let dataList = this.data.dataList;
    dataList.map(item => {
      if (item.id == obj.id) {
        if (obj.number < 1) {
          return wx.showToast({
            title: '商品数量不能小于1',
            icon: "none"
          })
        } else {
          obj.number++
          this.setData({
            curItem: obj
          })
          this.handleNum()
        }
      }
    })
  },
  //减少
  sub(e) {
    let obj = e.currentTarget.dataset.item;
    let dataList = this.data.dataList;
    dataList.map(item => {
      if (item.id == obj.id) {
        if (obj.number <= 1) {
          return wx.showToast({
            title: '商品数量不能小于1',
            icon: "none"
          })
        } else {
          // item.number--
          obj.number--
          this.setData({
            curItem: obj
          })
          this.handleNum()
        }
      }
    })
  },
  // 处理购物车商品数量
  handleNum() {
    let curItem = this.data.curItem
    let params = {
      url: 'cart/update',
      data: {
        id: curItem.id,
        goodsId: curItem.goodsId,
        number: curItem.number,
        productId: curItem.productId,
      },
      method: 'POST'
    }
    common.request(params).then(res => {
      this.getCartList()
    })
  },

  // 全选  取消全选
  selectAll() {
    let allCur = this.data.allCur
    allCur = !allCur
    let allIdArr = []
    let isChecked = allCur ? 1 : 0
    this.data.dataList.map(item => {
      allIdArr.push(item.productId)
    })
    this.handleSelect(allIdArr, isChecked)

  },
  // 选中 取消选中
  selectItem(e) {
    let obj = e.currentTarget.dataset.item;
    obj.checked = !obj.checked
    let isChecked = obj.checked ? 1 : 0

    this.handleSelect([obj.productId], isChecked)
  },
  // 选中 取消选中接口
  handleSelect(idArr, isChecked) {
    let params = {
      url: 'cart/checked',
      data: {
        productIds: idArr,
        isChecked: isChecked
      },
      method: 'POST'
    }
    common.request(params).then(res => {
      let idArr = []
      let dataList = res.data.cartList
      let cartTotal = res.data.cartTotal
      dataList.map(item => {
        item.txt = item.specifications.join('、')
        if (item.checked) {
          idArr.push(item.productId)
        }
      })
      this.setData({
        dataList,
        cartTotal,
        idArr,
        allCur: idArr.length == dataList.length
      })
    })
  },

  // 删除
  dlt() {

    if (this.data.idArr.length == 0) {
      return wx.showToast({
        title: '请选择购物车商品',
        icon: 'none'
      })
    }
    let params = {
      url: 'cart/delete',
      data: {
        productIds: this.data.idArr
      },
      method: 'POST'
    }
    common.request(params).then(res => {
      let dataList = res.data.cartList
      let cartTotal = res.data.cartTotal
      let idArr = []
      dataList.map(item => {
        item.txt = item.specifications.join('、')
        if (item.checked) {
          idArr.push(item.productId)
        }
      })
      this.setData({
        dataList,
        cartTotal,
        idArr,
        allCur: idArr.length == dataList.length
      })
    })
  },

  // 获取购物车列表
  getCartList() {
    let idArr = []
    let params = {
      url: '/cart/index',
      method: 'GET'
    }
    common.request(params).then(res => {
      let dataList = res.data.cartList
      let cartTotal = res.data.cartTotal
      dataList.map(item => {
        item.txt = item.specifications.join('、')
        if (item.checked) {
          idArr.push(item.productId)
        }
      })
  
      this.setData({
        dataList,
        cartTotal,
        idArr,
        allCur: idArr.length == dataList.length
      })
    })
  },
})