var e = null;

Page({
  data: {
    allResList: ["http://magzinefs7.nearme.com.cn/uploads/wallpaper/2/2018/12/21/5c1c58074a415_1080x1920.jpg", "http://magzinefs8.nearme.com.cn/uploads/wallpaper/1/2018/12/25/5c21da5010b60_1080x1920.jpg", "http://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/12/22/5c1daca2dc1b2_1080x1920.jpg", "http://magzinefs6.nearme.com.cn/uploads/wallpaper/0/2018/12/27/5c248e6892cd1_1080x1920.jpg"],
    currentImgIndex: 0,
    icon: ["../../image/YSG-x-logo.png"],
    addPersonNum: 0
  },
  onLoad: function () {
    this.setData({
      addPersonNum: parseInt(200 * Math.random() + 400)
    }), wx.createRewardedVideoAd && ((e = wx.createRewardedVideoAd({
      adUnitId: "adunit-9e9b61bbf0da8932"
    })).onLoad(function () { }), e.onError(function (e) { }), e.onClose(function (e) {
      e && e.isEnded ? wx.setClipboardData({
        data: "1178539345",
        success: function () {
          wx.showToast({
            title: "已复制快去添加"
          });
        }
      }) : wx.showToast({
        title: "你要看完才行哦",
        icon: "none"
      });
    }));
  },
  swiperChange: function (e) {
    var a = e.detail.current;
    this.setData({
      currentImgIndex: a
    });
  },
  previewImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src]
    });
  },
  addGroup: function () {
    e && e.show().catch(function () {
      e.load().then(function () {
        return e.show();
      }).catch(function (e) {
        console.log("激励视频 广告显示失败");
      });
    });
  },
  onShareAppMessage: function () {
    return {
      title: "仪式感壁纸",
      path: "pages/index/index"
    };
  }
});