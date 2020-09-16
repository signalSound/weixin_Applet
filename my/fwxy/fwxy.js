import common from '../../utils/common.js'
import Towxml from '../../utils/towxml/main.js'
let towxml = new Towxml()
Page({

  data: {
    data: ""
  },
  onLoad() {
    this.getData()
  },
  //获取内容
  getData() {
    let params = {
      url: "word/userWord2003ToHtml",
      method: 'get'
    }
    common.request(params).then(res => {
      let content = towxml.toJson(res.data, 'html')
      content.theme = 'light';
      this.setData({
        data: content
      });
    })
  },
})