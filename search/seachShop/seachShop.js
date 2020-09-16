import common from '../../utils/common.js'
Page({
  data: {
    historyList: [], // 历史记录
    hotList: [], // 热搜词
    defaultKeyword: {}, // 输入框默认关键词
  },
  onShow() {
    this.getKeyWordList()
  },
  handleVal(e) {
    this.data.defaultKeyword.keyword = e.detail.value
    this.setData({
      defaultKeyword: this.data.defaultKeyword
    })
  },
  // 点击搜索
  handleSearch(e) {
    let val = e.detail.value ? e.detail.value : this.data.defaultKeyword.keyword
    console.log(val)
    this.toSearch(val)
  },
  // 点击历史词  热搜词
  getKeyWord(e) {
    let val = e.currentTarget.dataset.item.keyword
    this.toSearch(val)
  },
  // 跳转到搜索页面
  toSearch(val) {
    wx.navigateTo({
      url: '/search/seachRecords/seachRecords?val=' + val,
    })
  },
  // 清空记录
  clearHistory() {
    let params = {
      url: '/search/clearhistory',
      method: 'POST'
    }
    common.request(params).then(res => {
      wx.showToast({
        title: '成功清空',
        icon: 'none'
      })
      this.getKeyWordList()
    })
  },
  // 获取搜索关键词
  getKeyWordList() {
    let params = {
      url: 'search/index',
      method: 'GET'
    }
    common.request(params).then(res => {
      this.setData({
        historyList: res.data.historyKeywordList,
        hotList: res.data.hotKeywordList,
        defaultKeyword: res.data.defaultKeyword ? res.data.defaultKeyword : {keyword: ''},
      })
    })
  }
})