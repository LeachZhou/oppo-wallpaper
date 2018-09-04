//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    mainActive: 'https://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/09/03/5b8cb5337111a_1080x1920.jpg.97.webp?uid=f3412d529b990ef65f6f3b0425bec6f7',
    mainList: [
      // 'https://magzinefs4.nearme.com.cn/uploads/wallpaper/1/2018/09/03/5b8cf3b710ac5_1080x1920.jpg.91.webp?uid=f3412d529b990ef65f6f3b0425bec6f7',
      // 'https://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/09/03/5b8cb3b67e2e4_1080x1920.jpg.88.webp?uid=f3412d529b990ef65f6f3b0425bec6f7',
      'https://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/09/03/5b8cb5b43eafe_1080x1920.jpg.81.webp?uid=f3412d529b990ef65f6f3b0425bec6f7',
      'https://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/09/03/5b8cb3cf23ac8_1080x1920.jpg.50.webp?uid=f3412d529b990ef65f6f3b0425bec6f7',
      'https://magzinefs4.nearme.com.cn/uploads/wallpaper/2/2018/09/04/5b8e073ccc625_1080x1920.jpg.95.webp?uid=f3412d529b990ef65f6f3b0425bec6f7'
    ],
    animationData: {},
    screenHeight: 0,
    screenWidth: 0,
    x: 0,
    y: 0,
    deg: 0,
    endOpacity: 1
  },
  onLoad: function() {
    //获取屏幕宽高
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
      }
    });
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res) {
    //     console.log(res.data);
    //   },
    //   fail: function(res) {
    //     console.log(res.data)
    //   }
    // })
  },
  movableChange: function(e) {
    let _this = this;
    console.log(`X: ${e.detail.x}`);
    console.log(`Y: ${e.detail.y}`);
    let deg = 0; // 旋转角度
    deg = -e.detail.x / 3;
    let animation = wx.createAnimation({
      transformOrigin: "50% 0",
      duration: 50,
      timingFunction: "ease",
      delay: 0
    })
    _this.animation = animation;
    animation.rotate(deg).step();
    _this.setData({
      animationData: animation.export()
    })
  },
  movableEnd: function(e) {
    let _this = this;
    console.log(`endX: ${e.changedTouches[0].pageX}`);
    console.log(`endY: ${e.changedTouches[0].pageY}`);
    let endX = e.changedTouches[0].pageX;
    let endY = e.changedTouches[0].pageY;
    if (endY < 300 && endX > 300) {
      _this.setData({
        endOpacity: 0
      })
      if (_this.data.mainList.length) {
        let mainActive = _this.data.mainList.shift();
        _this.setData({
          x: 0,
          y: 0,
          mainActive: mainActive,
          endOpacity: 1
        })
        _this.setData({
          mainList: _this.data.mainList
        })
      }
    } else {
      _this.setData({
        x: 0,
        y: 0
      })
    }
  }


})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果