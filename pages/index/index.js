var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
bmobInfo.init();

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    mainList: [],
    allResList: [],
    allResListLength: 0,
    viewList: [],
    screenHeight: 0,
    screenWidth: 0,
    imgscale: 1,
    imgY: 0,
    loading: false,
    imgNumEndTips: false,
    now: 0,
    initOpacity: 0,
    menuPopup: true,
    slideX: 0,
    shareCanvas: false,
    rpx: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 0,
    currentImg: 0,
    previewCurrentImg: 0,
    swiperCurrent: 0,
    preIndex: 0,
    swiperError: 0,
    leftBtn: false
  },
  onLoad() {
    //获取指定DOM信息
    let _this = this;
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          rpx: res.windowWidth / 375
        });
      }
    });
    _this.fecthBmob(_this, (res) => {
      _this.setData({
        swiperCurrent: 0
      }, () => {
        app.loadend();
      });
    });
  },
  animationfinish(res) {
    let _this = this;
    if (res.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0 
      if (res.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了（划了半天还是卡主不动，current连续为0，但是手快连续切换也可以达到这样的效果）
        _this.setData({
          swiperError: _this.data.swiperError + 1
        });
      } else { //正常轮播时，记录正确页码索引
        _this.setData({
          preIndex: res.detail.current
        });
        //将开关重置为0
        _this.setData({
          swiperError: 0
        });
      }
      if (_this.data.swiperError >= 3) { //在开关被触发3次以上
        console.error(_this.data.swiperError)
        _this.setData({
          swiperCurrent: _this.data.preIndex
        }); //重置current为正确索引
      }
    }
  },
  slideStart(e) {
    let _this = this;
    let x = e.changedTouches[0].pageX;
    let y = e.changedTouches[0].pageY;
    _this.setData({
      slideX: x
    })
  },
  slideEnd(e) {
    let _this = this;
    let x = e.changedTouches[0].pageX;
    if (_this.data.leftBtn) {
      if (_this.data.previewCurrentImg - _this.data.currentImg == 1) {
        _this.setData({
          previewCurrentImg: 0
        })
      } else if (_this.data.previewCurrentImg == 0 && _this.data.currentImg == 0 && x > _this.data.slideX) {
        _this.previousLoad();
      }
    } else {
      wx.showToast({
        title: '你滑什么滑~',
        image: '../../image/despise.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    }
    if (_this.data.currentImg == (_this.data.allResListLength - 1) && _this.data.currentImg - _this.data.previewCurrentImg == 1) {
      _this.setData({
        previewCurrentImg: _this.data.allResListLength - 1
      })
    } else if (_this.data.previewCurrentImg == (_this.data.allResListLength - 1) && _this.data.currentImg == (_this.data.allResListLength - 1) && x < _this.data.slideX) {
      _this.nextLoad();
    }
  },
  swiperChange(e) {
    let _this = this;
    _this.setData({
      previewCurrentImg: _this.data.currentImg
    })
    _this.setData({
      currentImg: e.detail.current,
      leftBtn: true
    })
  },
  previewImg(e) {
    let _this = this;
    let arr = [];
    for (let item of _this.data.viewList) {
      arr.push(item.img);
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  hrefUrl(e) {
    let _this = this;
    _this.menuTap();
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  fecthBmob(_this, fn, day) {
    app.loading();
    bmobInfo.index((res) => {
      if (res.length) {
        let flatArr = [...res];
        _this.setData({
          allResList: flatArr,
          viewList: flatArr,
          allResListLength: flatArr.length
        });
      } else {
        wx.showToast({
          title: '总是空空如也~',
          image: '../../image/blank.png',
          icon: 'none',
          mask: true,
          duration: 5000
        })
      }
      fn(res);
    }, day);
  },
  previousLoad() { //加载下一天
    let _this = this;
    _this.fecthBmob(_this, (res) => {
      if (res.length) {
        _this.setData({
          now: _this.data.now + 1
        });
      }
      if (_this.data.swiperCurrent != 0) {
        _this.setData({
          swiperCurrent: 0,
          currentImg: 0
        }, () => {
          app.loadend();
        });
      } else {
        _this.setData({
          currentImg: 0
        }, () => {
          app.loadend();
        });
      }
      _this.setData({
        leftBtn: false
      })
    }, _this.data.now + 1);
  },
  nextLoad() {
    let _this = this;
    _this.setData({
      loading: false,
      initOpacity: 0
    });
    _this.fecthBmob(_this, (res) => {
      if (res.length) {
        _this.setData({
          now: _this.data.now - 1
        });
      }
      _this.setData({
        swiperCurrent: 0,
        currentImg: 0
      }, () => {
        app.loadend();
      });
    }, _this.data.now - 1);
  },
  menuTap() {
    let _this = this;
    _this.data.menuPopup ? _this.setData({
      menuPopup: false
    }) : _this.setData({
      menuPopup: true
    })
  },
  onShareAppMessage(ops) {
    let _this = this;
    let title = '';
    let imageUrl = '';
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target);
      title = ops.target.dataset.title;
      imageUrl = ops.target.dataset.src;
    } else {
      title = '仪式感壁纸';
      imageUrl = 'http://bmob-cdn-21525.b0.upaiyun.com/2018/09/18/6dd1101a4068d5f8805e0168215f9f87.png';
    }
    return {
      title: title,
      path: 'pages/index/index',
      imageUrl: imageUrl,
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  /**
   * 圆角矩形
   * x 矩形的x坐标
   * y 矩形的y坐标
   * w 矩形的宽
   * h 矩形的高
   * r 矩形的圆角度数
   */
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath();
    this.ctx.setFillStyle('#ffffff');
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);
    this.ctx.fill();
    this.ctx.setGlobalAlpha(0.04);
    this.ctx.setShadow(0, 2, 4, '#000000');
    ctx.closePath();
    this.ctx.draw(true);
    return this;
  },
  friends() {
    let _this = this;
    let rpx = _this.data.rpx;
    _this.setData({
      shareCanvas: true
    })
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    let ctx = wx.createCanvasContext('canvas');

    ctx.drawImage(_this.data.mainList[0].img, 0, 1920 / 10, 1235, 2195, 0, 0, 320 * rpx, 320 / 1080 * 1920 * rpx);

    ctx.save()
    ctx.beginPath()
    ctx.arc(50, 50, 25, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(_this.data.mainList[1].img, 25, 25)
    ctx.restore()


    ctx.setFontSize(12);
    ctx.setFillStyle('transparent'); //设置填充色s
    ctx.setTextAlign('center'); //用于设置文字的对齐
    ctx.fillRect(10, 10, 150, 75); //填充一个矩形
    ctx.fillText(_this.data.mainList[0].title, 20, 1900); //在画布上绘制被填充的文本
    ctx.draw(false, () => {
      _this.saveToTempFilePath()
    })
    wx.hideLoading();
  },
  info() {
    wx.getImageInfo({
      src: miniProgramCodeSrc,
      success: (response) => {
        const miniProgramCodeSize = this.transformScale(160)
        ctx.drawImage(response.path, this.transformScale(85), this.transformScale(710), miniProgramCodeSize, miniProgramCodeSize)

        wx.getImageInfo({
          src: this.privateUserInfo.avatar,
          success: (response) => {
            const avatarSize = this.transformScale(100)
            //先绘制圆，裁剪成圆形图片
            ctx.save();
            ctx.beginPath();
            //圆的原点x坐标，y坐标，半径，起始弧度，终止弧度
            ctx.arc(this.transformScale(320), this.transformScale(425), avatarSize / 2, 0, 2 * Math.PI);
            ctx.setStrokeStyle('#ffffff');
            ctx.stroke();
            ctx.clip();

            ctx.drawImage(response.path, this.transformScale(270), this.transformScale(375), avatarSize, avatarSize)
            ctx.restore();

            ctx.draw(false, () => {
              this.saveToTempFilePath()
            })
          }
        })
      }
    })
  },
  //获取 tempFilePath
  saveToTempFilePath() {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: (response) => {

      }
    }, this)
  },
  //获取保存权限
  savePermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.saveImageToPhotosAlbumByWX(response.tempFilePath)
            }
          })
        } else {
          this.saveImageToPhotosAlbumByWX(response.tempFilePath)
        }
      }
    })
  },
  //保存图片到相册
  saveImageToPhotosAlbumByWX(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      complete: () => {
        // 其他操作
      }
    })
  },
  maskingTap() {
    let _this = this;
    _this.setData({
      shareCanvas: false
    })
  }
})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果
//https://camo.githubusercontent.com/ffd745dc2e0e3f55b31b6e109c3869e58471b36e/68747470733a2f2f63646e2e6472696262626c652e636f6d2f75736572732f313737383634322f73637265656e73686f74732f333832333930302f5f5f5f2d3131312e676966