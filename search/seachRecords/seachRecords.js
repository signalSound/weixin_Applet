import common from '../../utils/common.js'
Page({
  data: {
    params: {
      page: 1,
      limit: 10,
      keyword: '',
      sort: 'name',
      order: 'desc'
    },
    total: 0,
    dataList: [],

    carNum: 0,
    filterCategoryList: [], // 分类数组
  },
  onShow() {
    this.getCarNum()
  },
  onLoad(opt) {
    console.log(opt)

    let params = this.data.params
    params.keyword = opt.val ? opt.val : ''

    if (opt.name) {
      wx.setNavigationBarTitle({
        title: opt.name
      })
    }

    this.setData({
      params
    })
    if (opt.id) {
      let id = opt.id
      this.getSortList(id)
    }else{
      this.getList()
    }
  },
  // 选择分类
  getSort(e) {
    let id = e.currentTarget.dataset.id
    let params = this.data.params
    params.categoryId =  params.categoryId == id ? '' : id
    params.page = 1
    this.setData({
      params,
      dataList: []
    })
    this.getList()
  },
  // 跳转到商品详情
  toProductDetails(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/productDetails/productDetails?id=' + id,
    })
  },
  handleVal(e) {
    let params = this.data.params
    params.keyword = e.detail.value
    this.setData({
      params
    })
    if (e.detail.value != '') return
    params.page = 1
    this.setData({
      params,
      dataList: []
    })
    this.getList()
  },
  // 搜索
  handleSearch(e) {
    let params = this.data.params
    params.keyword = e.detail.value ? e.detail.value : this.data.params.keyword
    params.page = 1
    this.setData({
      params,
      dataList: []
    })
    this.getList()
  },
  // 切换类型
  handleSort(e) {
    let sort = e.currentTarget.dataset.item
    let params = this.data.params
    if (params.sort == sort) return
    params.sort = sort
    params.page = 1
    this.setData({
      params,
      dataList: []
    })
    this.getList()
  },
  // 升序降序
  handleOrder() {
    let params = this.data.params
    params.order = params.order === 'desc' ? 'asc' : 'desc'
    params.page = 1
    this.setData({
      params,
      dataList: []
    })
    this.getList()
  },
  toCartPage() {
    wx.navigateTo({
      url: '/my/shoppingCart/shoppingCart',
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
      let params = this.data.params
      let dataList = [...this.data.dataList, ...res.data.list]

      this.setData({
        dataList,
        total: res.data.total,
        params
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
  // 购物车数量
  getCarNum() {
    let params = {
      url: 'cart/index',
      method: 'GET'
    }
    common.request(params).then(res => {
      this.setData({
        carNum: res.data.cartTotal.goodsCount
      })
    })
  },
  // 获取分类
  getSortList(id) {
    let params = {
      url: 'goods/category',
      data: {
        id: id
      },
      method: 'GET'
    }
    common.request(params).then(res => {
      let filterCategoryList = res.data.brotherCategory
      let params = this.data.params
      // if(filterCategoryList.length){
      //   params.categoryId = filterCategoryList[0].id
      // }
      params.categoryId = id
      this.setData({
        filterCategoryList,
        params
      })
      this.getList()
    })
  }
})