var Bmob = require('../../utils/Bmob-1.6.3.min.js');
var oppoJson = require('../../utils/oppoJson.js');
var oppo20180906 = require('../../utils/data/oppo20180906.js');

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    mainActive: {},
    mainList: [],
    allResList: [],
    animationData: {},
    screenHeight: 0,
    screenWidth: 0,
    x: 0,
    y: 0,
    deg: 0,
    endOpacity: 1,
    titleOpacity: 1
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
  onReady: function() {
    let _this = this;
    _this.setData({
      allResList: oppoJson.oppoJson(oppo20180906.data)
    });
    let mainListTemp = [];
    for (let i = 0; i < 4; i++) {
      mainListTemp.push(_this.data.allResList[i]);
    }
    for (let i = 0; i < 4; i++) {
      _this.data.allResList.shift();
    }
    let mainActiveTemp = mainListTemp.shift();
    _this.setData({
      mainActive: mainActiveTemp,
      mainList: mainListTemp
    });

    // wx.request({
    //   url: 'xxxxxxxxxxxxxx',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data); 
    //   },
    //   fail: function (res) {
    //     console.log(res.data)
    //   }
    // })
  },
  movableChange: function(e) {
    let _this = this; 
    // console.log(`X: ${e.detail.x}`);
    // console.log(`Y: ${e.detail.y}`);
    let deg = 0; // 旋转角度
    deg = e.detail.x / 2.5;
    let animation = wx.createAnimation({
      transformOrigin: "50% 100%",
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    // _this.animation = animation;
    animation.rotate(deg).step();
    _this.setData({
      animationData: animation.export()
    })
    let titleOpacity;
    if (e.detail.x == 0 && e.detail.y == 0) {
      titleOpacity = 1;
    } else {
      titleOpacity = 0;
    }
    _this.setData({
      titleOpacity: titleOpacity
    })
  },
  movableEnd: function(e) {
    let _this = this;
    // console.log(`endX: ${e.changedTouches[0].pageX}`);
    // console.log(`endY: ${e.changedTouches[0].pageY}`);
    let endX = e.changedTouches[0].pageX;
    let endY = e.changedTouches[0].pageY;
    if (endY < 300 && endX > 300) {
      _this.setData({
        endOpacity: 0
      })
      if (_this.data.mainList.length) {
        let mainActive = _this.data.mainList.shift();
        requestAnimationFrame(function() {
          _this.setData({
            mainActive: mainActive,
            x: 0,
            y: 0
          })
        })
        requestAnimationFrame(function() {
          _this.setData({
            imgscale: 1 / 0.9,
            imgY: 60,
          })
        })
        requestAnimationFrame(function() {
          _this.setData({
            endOpacity: 1
          })
        })
        requestAnimationFrame(function() {
          _this.setData({
            imgscale: 1,
            imgY: 0,
          })
        })
        requestAnimationFrame(function() {
          _this.setData({
            mainList: _this.data.mainList
          })
        })
      }
    } else {
      _this.setData({
        x: 0,
        y: 0
      })
    }
  },
  previewImg: function() {
    let _this = this;
    let arr = [];
    arr.push(_this.data.mainActive.img);
    wx.previewImage({
      urls: arr // 需要预览的图片http链接列表
    })
  }

})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果
//https://camo.githubusercontent.com/ffd745dc2e0e3f55b31b6e109c3869e58471b36e/68747470733a2f2f63646e2e6472696262626c652e636f6d2f75736572732f313737383634322f73637265656e73686f74732f333832333930302f5f5f5f2d3131312e676966