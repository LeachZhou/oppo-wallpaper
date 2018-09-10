var Bmob = require('../../utils/Bmob-1.6.3.min.js');
var oppoJson = require('../../utils/oppoJson.js');
var util = require('../../utils/util.js');
var oppo20180906 = require('../../utils/data/oppo20180906.js');
Bmob.initialize("6e810df9cb70d3817a543d38dce1408e", "0a764f82abda7265092c87ed19dca294");

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    mainActive: {},
    mainList: [],
    allResList: [],
    viewList: [],
    animationData: {},
    screenHeight: 0,
    screenWidth: 0,
    x: 0,
    y: 0,
    deg: 0,
    endOpacity: 1,
    titleOpacity: 1,
    imgscale: 1,
    imgY: 0,
    imgActiveWidth: 0,
    imgActiveHeight: 0,
    hahaHover: '',
    loveHover: '',
    likeHover: '',
    wowHover: '',
    sadHover: '',
    angryHover: '',
    sadAreaHover: '',
    loveAreaHover: ''
  },
  onLoad: function() {
    //获取指定DOM信息
    let _this = this;
    var query = wx.createSelectorQuery();
    query.select('.change-img-active').boundingClientRect(function(res) {
      _this.setData({
        imgActiveWidth: res.width,
        imgActiveHeight: res.height
      });
    }).exec();
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
      }
    });
    const wallpaperQuery = Bmob.Query('wallpaper');
    wallpaperQuery.equalTo("createdAt", ">", util.formatTime(new Date()).split(' ')[0] + ' 00:00:00');
    wallpaperQuery.find().then(res => {
      let arr = [];
      for (let item of res) {
        arr.push(oppoJson.oppoJson(item.wallpaperData));
      }
      _this.setData({
        allResList: util.flatten(arr),
        viewList: util.flatten(arr)
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
    });
  },
  onReady: function() {
    let _this = this;
    _this.setData({
      x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
      y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2,
    });
  },
  movableChange: function(e) {
    let _this = this;
    console.log(`X: ${e.detail.x}`);
    console.log(`Y: ${e.detail.y}`);
    let x = e.detail.x,
      y = e.detail.y;
    let a = _this.data.screenWidth - _this.data.imgActiveWidth;
    let b = _this.data.screenHeight - _this.data.imgActiveHeight;
    if (x > a * 0.64) {
      _this.setData({
        loveAreaHover: 'love-area-hover'
      })
    } else {
      _this.setData({
        loveAreaHover: ''
      })
    }
    if (x < a * 0.34) {
      _this.setData({
        sadAreaHover: 'sad-area-hover'
      })
    } else {
      _this.setData({
        sadAreaHover: ''
      })
    }
    if (x < a * 0.34 && y < b * 0.246) {
      _this.setData({
        wowHover: 'emoji-hover'
      })
    } else {
      _this.setData({
        wowHover: ''
      })
    }
    if (x < a * 0.34 && y >= b * 0.246 && y < b * 0.59) {
      _this.setData({
        sadHover: 'emoji-hover'
      })
    } else {
      _this.setData({
        sadHover: ''
      })
    }
    if (x < a * 0.34 && y >= b * 0.59) {
      _this.setData({
        angryHover: 'emoji-hover'
      })
    } else {
      _this.setData({
        angryHover: ''
      })
    }
    if (x > a * 0.64 && y < b * 0.246) {
      _this.setData({
        hahaHover: 'emoji-hover'
      })
    } else {
      _this.setData({
        hahaHover: ''
      })
    }
    if (x > a * 0.64 && y >= b * 0.246 && y < b * 0.59) {
      _this.setData({
        likeHover: 'emoji-hover'
      })
    } else {
      _this.setData({
        likeHover: ''
      })
    }
    if (x > a * 0.64 && y >= b * 0.59) {
      _this.setData({
        loveHover: 'emoji-hover'
      })
    } else {
      _this.setData({
        loveHover: ''
      })
    }
    // let deg = 0; // 旋转角度
    // deg = e.detail.x / 2.5;
    // let x = 0;
    // deg = e.detail.x;
    // let animation = wx.createAnimation({
    //   transformOrigin: "50% 100%",
    //   duration: 100,
    //   timingFunction: "ease",
    //   delay: 0
    // })
    // _this.animation = animation;
    // animation.translateX(x).step();
    // _this.setData({
    //   animationData: animation.export()
    // })
    let titleOpacity;
    if (e.detail.x == (_this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2) && e.detail.y == (_this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2)) {
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
    //console..log(`endX: ${e.changedTouches[0].pageX}`);
    //console..log(`endY: ${e.changedTouches[0].pageY}`);
    let endX = e.changedTouches[0].pageX;
    let endY = e.changedTouches[0].pageY;
    if (_this.data.likeHover) {
      this.origin(this, () => {

      });
    } else if (_this.data.loveHover) {
      this.origin(this, () => {});
    } else if (_this.data.hahaHover) {
      this.origin(this, () => {});
    } else if (_this.data.wowHover) {
      this.origin(this, () => {});
    } else if (_this.data.sadHover) {
      this.origin(this, () => {});
    } else if (_this.data.angryHover) {
      this.origin(this, () => {});
    } else {
      _this.setData({
        x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
        y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2
      })
    }
  },
  previewImg: function() {
    let _this = this;
    let arr = [];
    for (let item of _this.data.viewList) {
      arr.push(item.img);
    }
    wx.previewImage({
      current: _this.data.mainActive, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  origin: function(_this, fn) {
    fn();
    _this.setData({
      endOpacity: 0
    })
    if (_this.data.mainList[0]) {
      let mainActive = _this.data.mainList.shift();
      // requestAnimationFrame(function() {
      //   _this.setData({
      //     mainActive: mainActive,
      //     x: 0,
      //     y: 0
      //   })
      // })
      // requestAnimationFrame(function() {
      //   _this.setData({
      //     imgscale: 1 / 0.9,
      //     imgY: 60,
      //   })
      // })
      // requestAnimationFrame(function() {
      //   _this.setData({
      //     endOpacity: 1
      //   })
      // })
      // requestAnimationFrame(function() {
      //   _this.setData({
      //     imgscale: 1,
      //     imgY: 0,
      //   })
      // })
      // requestAnimationFrame(function() {
      //   _this.setData({
      //     mainList: _this.data.mainList
      //   })
      // }) 
      setTimeout(() => {
        _this.setData({
          mainActive: mainActive,
          x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
          y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2
        })
      }, 0)
      setTimeout(() => {
        this.setData({
          imgscale: 1 / 0.9,
          imgY: 30
        })
      }, 100)
      setTimeout(() => {
        _this.setData({
          endOpacity: 1,
          imgscale: 1,
          imgY: 0
        })
      }, 200)
      setTimeout(() => {
        _this.data.mainList.push(_this.data.allResList.shift());
        _this.setData({
          mainList: _this.data.mainList
        })
      }, 200)
    } else {

    }
  }

})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果
//https://camo.githubusercontent.com/ffd745dc2e0e3f55b31b6e109c3869e58471b36e/68747470733a2f2f63646e2e6472696262626c652e636f6d2f75736572732f313737383634322f73637265656e73686f74732f333832333930302f5f5f5f2d3131312e676966