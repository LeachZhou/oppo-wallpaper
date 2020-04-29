Page({
  data: {
    allResList: [
      "http://magzinefs7.nearme.com.cn/uploads/wallpaper/2/2018/12/21/5c1c58074a415_1080x1920.jpg",
      "http://magzinefs8.nearme.com.cn/uploads/wallpaper/1/2018/12/25/5c21da5010b60_1080x1920.jpg",
      "http://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/12/22/5c1daca2dc1b2_1080x1920.jpg",
      "http://magzinefs6.nearme.com.cn/uploads/wallpaper/0/2018/12/27/5c248e6892cd1_1080x1920.jpg"
    ], // 图片数组
    currentImgIndex: 0,
    icon: [
      "../../image/YSG-x-logo.png"
    ]
  },
  onLoad () { },
  swiperChange (e) {
    const { current } = e.detail
    this.setData({ currentImgIndex: current })
  },
  /**
   * 预览图片
   */
  previewImg (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  /**
   * 加微信
   */
  addGroup () {
    wx.setClipboardData({
      data: "1178539345",
      success () {
        wx.showToast({ title: '微信号已复制' })
      }
    })
  },
  /**
   * 转发
   */
  onShareAppMessage () {
    return {
      title: "仪式感壁纸",
      path: "pages/index/index"
    }
  }
})