//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    screenHeight: 0,
    screenWidth: 0,
    x: 0,
    y: 0,
    deg: 0
  },
  onLoad: function() {
    //获取屏幕宽高
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },
  movableChange: function(e) {
    console.log(e.detail);
    let deg = 0;
    e.detail.x > 0 ? deg = 110 : deg = 0;
    e.detail.x < 0 ? deg = 20 : deg = 0;
    this.setData({
      deg: deg
    });
  }


})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果