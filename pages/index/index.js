var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
bmobInfo.init();

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
    loveAreaHover: '',
    loading: false,
    imgNumEndTips: false,
    now: 0,
    initOpacity: 0,
    menuPopup: true
  },
  onLoad() {
    //获取指定DOM信息
    let _this = this;
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
      }
    });
    let query = wx.createSelectorQuery();
    query.select('.change-img-active').boundingClientRect(function(res) {
      _this.setData({
        imgActiveWidth: res.width,
        imgActiveHeight: res.height,
        x: _this.data.screenWidth / 2 - res.width / 2,
        y: _this.data.screenHeight / 2 - res.height / 2
      });
    }).exec();
    _this.fecthBmob(_this, () => {
      _this.setData({
        loading: true,
        initOpacity: 1
      });
    });
  },
  onReady() {
    let _this = this;
  },
  movableChange(e) {
    let _this = this;
    // console.log(`X: ${e.detail.x}`);
    // console.log(`Y: ${e.detail.y}`);
    let x = e.detail.x,
      y = e.detail.y;
    let a = _this.data.screenWidth - _this.data.imgActiveWidth;
    let b = _this.data.screenHeight - _this.data.imgActiveHeight;
    // if (x > a * 0.64) {
    //   _this.setData({
    //     loveAreaHover: 'love-area-hover'
    //   })
    // } else {
    //   _this.setData({
    //     loveAreaHover: ''
    //   })
    // }
    // if (x < a * 0.34) {
    //   _this.setData({
    //     sadAreaHover: 'sad-area-hover'
    //   })
    // } else {
    //   _this.setData({
    //     sadAreaHover: ''
    //   })
    // }
    // if (x < a * 0.34 && y < b * 0.246) {
    //   _this.setData({
    //     wowHover: 'emoji-hover'
    //   })
    // } else {
    //   _this.setData({
    //     wowHover: ''
    //   })
    // }
    // if (x < a * 0.34 && y >= b * 0.246 && y < b * 0.59) {
    //   _this.setData({
    //     sadHover: 'emoji-hover'
    //   })
    // } else {
    //   _this.setData({
    //     sadHover: ''
    //   })
    // }
    // if (x < a * 0.34 && y >= b * 0.59) {
    //   _this.setData({
    //     angryHover: 'emoji-hover'
    //   })
    // } else {
    //   _this.setData({
    //     angryHover: ''
    //   })
    // }
    // if (x > a * 0.64 && y < b * 0.246) {
    //   _this.setData({
    //     hahaHover: 'emoji-hover'
    //   })
    // } else {
    //   _this.setData({
    //     hahaHover: ''
    //   })
    // }
    // if (x > a * 0.64 && y >= b * 0.246 && y < b * 0.59) {
    //   _this.setData({
    //     likeHover: 'emoji-hover'
    //   })
    // } else {
    //   _this.setData({
    //     likeHover: ''
    //   })
    // }
    // if (x > a * 0.64 && y >= b * 0.59) {
    //   _this.setData({
    //     loveHover: 'emoji-hover'
    //   })
    // } else {
    //   _this.setData({
    //     loveHover: ''
    //   })
    // }



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
    if (e.detail.x == _this.data.x && e.detail.y == _this.data.y) {
      titleOpacity = 1;
    } else {
      titleOpacity = 0;
    }
    _this.setData({
      titleOpacity: titleOpacity
    })
  },
  movableEnd(e) {
    let _this = this;
    //console..log(`endX: ${e.changedTouches[0].pageX}`);
    //console..log(`endY: ${e.changedTouches[0].pageY}`);
    let endX = e.changedTouches[0].pageX;
    let endY = e.changedTouches[0].pageY;
    if (endX > 300) {
      this.origin(this, () => {});
    } else {
      _this.setData({
        x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
        y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2
      })
    }
    // if (_this.data.likeHover) {
    //   this.origin(this, () => {

    //   });
    // } else if (_this.data.loveHover) {
    //   this.origin(this, () => {});
    // } else if (_this.data.hahaHover) {
    //   this.origin(this, () => {});
    // } else if (_this.data.wowHover) {
    //   this.origin(this, () => {});
    // } else if (_this.data.sadHover) {
    //   this.origin(this, () => {});
    // } else if (_this.data.angryHover) {
    //   this.origin(this, () => {});
    // } else {
    //   _this.setData({
    //     x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
    //     y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2
    //   })
    // }
  },
  previewImg() {
    let _this = this;
    let arr = [];
    for (let item of _this.data.viewList) {
      arr.push(item.img);
    }
    wx.previewImage({
      current: _this.data.mainActive.img, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  origin(_this, fn) {
    fn();
    _this.setData({
      endOpacity: 0
    })
    if (_this.data.mainList[0]) {
      let mainActive = _this.data.mainList.shift() || {};
      // requestAnimationFrame(() => {
      //   _this.setData({
      //     mainActive: mainActive,
      //     x: 0,
      //     y: 0
      //   })
      // })
      // requestAnimationFrame(() => {
      //   _this.setData({
      //     imgscale: 1 / 0.9,
      //     imgY: 60,
      //   })
      // })
      // requestAnimationFrame(() => {
      //   _this.setData({
      //     endOpacity: 1
      //   })
      // })
      // requestAnimationFrame(() => {
      //   _this.setData({
      //     imgscale: 1,
      //     imgY: 0,
      //   })
      // })
      // requestAnimationFrame(() => {
      //   _this.setData({
      //     mainList: _this.data.mainList
      //   })
      // }) 
      setTimeout(() => {
        _this.setData({
          mainActive: mainActive,
          x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
          y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2,
          imgscale: 1 / 0.9,
          imgY: 30
        })
      }, 0)
      setTimeout(() => {
        _this.data.mainList.push(_this.data.allResList.shift());
        _this.setData({
          endOpacity: 1,
          imgscale: 1,
          imgY: 0,
          mainList: _this.data.mainList
        })
      }, 600)
    } else {
      _this.setData({
        imgNumEndTips: true
      })
    }
  },
  hrefUrl(e) {
    let _this = this;
    _this.menuTap();
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  fecthBmob(_this, fn, day) {
    bmobInfo.index(function(res) {
      let flatArr = [...res];
      _this.setData({
        allResList: flatArr,
        viewList: flatArr
      });
      let mainListTemp = [];
      for (let i = 0; i < 4; i++) {
        mainListTemp.push(_this.data.allResList[i]);
      }
      for (let i = 0; i < 4; i++) {
        _this.data.allResList.shift();
      }
      let mainActiveTemp = mainListTemp.shift();
      if (!mainActiveTemp) {
        _this.setData({
          imgNumEndTips: true
        });
      } else {
        _this.setData({
          x: _this.data.screenWidth / 2 - _this.data.imgActiveWidth / 2,
          y: _this.data.screenHeight / 2 - _this.data.imgActiveHeight / 2,
          endOpacity: 1,
          imgNumEndTips: false,
          mainActive: mainActiveTemp,
          mainList: mainListTemp
        }, () => {
          let query = wx.createSelectorQuery();
          query.select('.change-img-active').boundingClientRect(function(res) {
            _this.setData({
              imgActiveWidth: res.width,
              imgActiveHeight: res.height,
              x: _this.data.screenWidth / 2 - res.width / 2,
              y: _this.data.screenHeight / 2 - res.height / 2
            });
          }).exec();
        });
      }
      fn();
    }, day);
  },
  Reload() {
    let _this = this;
    _this.setData({
      loading: false,
      initOpacity: 0
    });
    _this.fecthBmob(_this, () => {
      _this.setData({
        loading: true,
        initOpacity: 1,
        titleOpacity: 1
      });
    }, _this.data.now);
  },
  nextLoad() {
    let _this = this;
    _this.setData({
      loading: false,
      initOpacity: 0
    });
    _this.setData({
      now: _this.data.now - 1
    })
    _this.fecthBmob(_this, () => {
      _this.setData({
        loading: true,
        initOpacity: 1,
        titleOpacity: 1
      });
    }, _this.data.now);
  },
  menuTap() {
    let _this = this;
    _this.data.menuPopup ? _this.setData({
      menuPopup: false
    }) : _this.setData({
      menuPopup: true
    })
  }
})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果
//https://camo.githubusercontent.com/ffd745dc2e0e3f55b31b6e109c3869e58471b36e/68747470733a2f2f63646e2e6472696262626c652e636f6d2f75736572732f313737383634322f73637265656e73686f74732f333832333930302f5f5f5f2d3131312e676966