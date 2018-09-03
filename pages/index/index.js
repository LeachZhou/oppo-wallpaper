//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imageActive: '../../image/1.jpg',
    imageList: [
      '../../image/2.jpg',
      '../../image/3.jpg',
      '../../image/4.jpg'
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
  },
  movableChange: function(e) {
    console.log(`X: ${e.detail.x}`);
    console.log(`Y: ${e.detail.y}`);
    let deg = 0; // 旋转角度
    deg = -e.detail.x / 3;
    var animation = wx.createAnimation({
      transformOrigin: "50% 0",
      duration: 50,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation;
    animation.rotate(deg).step();
    this.setData({
      animationData: animation.export()
    })

  },
  movableEnd: function(e) {
    console.log(`endX: ${e.changedTouches[0].pageX}`);
    console.log(`endY: ${e.changedTouches[0].pageY}`);
    let endX = e.changedTouches[0].pageX;
    let endY = e.changedTouches[0].pageY;
    if (endY < 300 && endX > 300) {
      this.setData({
        endOpacity: 0
      })
      if (this.data.imageList.length) {
        let imageActiveChange = this.data.imageList[0];
        this.setData({
          x: 0,
          y: 0,
          imageActive: imageActiveChange,
          endOpacity: 1
        })
        this.data.imageList.shift();
        this.setData({
          imageList: this.data.imageList
        })
      }
    } else {
      this.setData({
        x: 0,
        y: 0
      })
    }
  }


})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果