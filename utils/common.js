// const baseUrl = "http://8.129.211.54:8080/wx/"
// const baseUrl = "http://172.20.10.6:8080/wx/"
// const baseUrl = "http://121.196.40.32:8080/wx/"
const baseUrl = "https://yxb61.com/wx/"

const imgUrl = baseUrl + '/static/xiaochengxu/'
const modules = {
  baseUrl: baseUrl,
  imgUrl: imgUrl,

  secondsFormat(v) {
    let day = Math.floor(v / (24 * 3600));
    let hour = Math.floor((v - day * 24 * 3600) / 3600);
    let minute = Math.floor((v - day * 24 * 3600 - hour * 3600) / 60);
    let second = v - day * 24 * 3600 - hour * 3600 - minute * 60;
    // return day + "天" + hour + "时" + minute + "分" + second + "秒";
    return minute + "分" + second + "秒";
  },
  // 时间戳转字符串
  timeToStr (v){
    let date = new Date(v * 1000),
      year = date.getFullYear(),
      mouth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
      day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
      hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
      minu = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
      sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return year + '-' + mouth + '-' + day
  },

  request(params) {
    if (params.hasOwnProperty('loadding')) {
      wx.showLoading({
        title: params.loadding.title || "数据加载中",
      })
    }

    let token = wx.getStorageSync('token')
    return new Promise((res, rej) => {
      wx.request({
        url: this.baseUrl + params.url,
        data: params.data,
        method: params.method,
        header: {
          'Content-Type': params.contentType ? params.contentType : '',
          'X-Litemall-Token': token
        },
        success: (r) => {
          wx.hideLoading()
          let arr = [703, 706, 725, 401, 700, 402, 708, 502, 701]
          console.log(arr.indexOf(r.data.errno), 'indexOf')
          // if(arr.indexOf(r.data.errno))
          if (arr.indexOf(r.data.errno) !== -1) {
            wx.showToast({
              title: r.data.errmsg,
              icon: 'none'
            })
            // rej(r.data)
            return
          }
          // if (r.data.errno == '700' || r.data.errno == '402' || r.data.errno =='725' || r.data.errno =='708' || r.data.errno == '401' || r.data.errno == '703' || r.data.errno == '706' ) {
          //   wx.showToast({
          //     title: r.data.errmsg,
          //     icon: 'none'
          //   })
          //   rej(r.data)
          //   return
          // }
          if (r.data.errno == '501') {
            wx.showModal({
              title: '提示',
              content: '请前往登录',
              success: (res) => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/login/loginPage/loginPage',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return
          }
          res(r.data)
        }
      })
    })

  },
}
module.exports = modules