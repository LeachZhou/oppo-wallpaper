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
    swiperError: 0, //swiper错误
    leftBtn: false, //左边按钮是否显示
    blank: false, //是否为空
    activeInfo: {}, //当前显示的大图
    scene: '', //微信小程序二维码相关scene
    isOpacity: false //swiper内除图片其他元素是否透明
  },
  onLoad(options) {
    //获取指定DOM信息
    let _this = this;
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    let scene = decodeURIComponent(options.scene)
    _this.setData({
      scene: scene
    });
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
    //请求数据
    _this.fecthBmob(_this, (res, time1) => {
      _this.setData({
        swiperCurrent: 0,
        activeInfo: res[0]
      }, () => {
        app.loadend();
        // let time2 = Number(new Date());
        // wx.showLoading({
        //   title: `时间：${time2 - time1}`,
        //   mask: true
        // })
      });
    });
  },
  /**
   * 数据请求
   */
  fecthBmob(_this, fn, day) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    let time1 = Number(new Date());
    bmobInfo.index((res) => {
      wx.showLoading({
        title: '渲染图片中...',
        mask: true
      })
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
          duration: 2000
        })
        _this.setData({
          blank: true
        });
      }
      fn(res, time1);
    }, day);
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
  /**
   * 滑动操作开始
   */
  slideStart(e) {
    let _this = this;
    let x = e.changedTouches[0].pageX;
    let y = e.changedTouches[0].pageY;
    _this.setData({
      slideX: x,
      isOpacity: true
    })
  },
  /**
   * 滑动操作结束
   */
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
      if (x > _this.data.slideX) {
        //第一个彩蛋
        wx.showToast({
          title: '你滑什么滑~',
          image: '../../image/despise.png',
          icon: 'none',
          mask: true,
          duration: 2000
        })
      }
    }
    if (_this.data.currentImg == (_this.data.allResListLength - 1) && _this.data.currentImg - _this.data.previewCurrentImg == 1) {
      _this.setData({
        previewCurrentImg: _this.data.allResListLength - 1
      })
    } else if (_this.data.previewCurrentImg == (_this.data.allResListLength - 1) && _this.data.currentImg == (_this.data.allResListLength - 1) && x < _this.data.slideX) {
      _this.nextLoad();
    }
    _this.setData({
      isOpacity: false
    })
  },
  /**
   * 轮播滑动
   */
  swiperChange(e) {
    let _this = this;
    _this.setData({
      previewCurrentImg: _this.data.currentImg
    })
    _this.setData({
      currentImg: e.detail.current,
      activeInfo: _this.data.allResList[e.detail.current],
      leftBtn: true
    })
  },
  /**
   * 预览图片
   */
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
  /**
   * 页面跳转
   */
  hrefUrl(e) {
    let _this = this;
    _this.menuTap();
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 加载下一天
   */
  previousLoad() {
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
        if (!_this.data.blank) { //如果空空如也没有显示
          _this.setData({
            currentImg: 0
          }, () => {
            app.loadend();
          });
        } else { //如果空空如也显示了，不消失toast，它会5秒后自动消失
          _this.setData({
            currentImg: 0
          });
        }
      }
      _this.setData({
        leftBtn: false
      })
    }, _this.data.now + 1);
  },
  /**
   * 加载上一天
   */
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
  /**
   * 点击菜单
   */
  menuTap() {
    let _this = this;
    _this.data.menuPopup ? _this.setData({
      menuPopup: false
    }) : _this.setData({
      menuPopup: true
    })
  },
  /**
   * 转发功能
   */
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
      imageUrl = 'https://ws1.sinaimg.cn/large/e83d3594gy1fvricfp4zlj20dc0aodh6.jpg';
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
   * 绘制圆角矩形
   * x 矩形的x坐标
   * y 矩形的y坐标
   * w 矩形的宽
   * h 矩形的高
   * r 矩形的圆角度数
   */
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.save();
    ctx.beginPath();
    ctx.setFillStyle('#ffffff');
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
    ctx.fill();
    ctx.setGlobalAlpha(0.04);
    ctx.setShadow(0, 2, 4, '#000000');
    ctx.closePath();
    ctx.draw(true);
    return ctx;
  },
  /**
   * 保存canvas一些用法
   */
  canvasTemp() {
    //保存状态
    ctx.save();
    //开始绘制
    ctx.beginPath();
    /**
     * 画一条弧线 
     * number x 圆心的 x 坐标
     * number y 圆心的 y 坐标
     * number r 圆的半径
     * number sAngle 起始弧度，单位弧度（在3点钟方向）
     * number eAngle 终止弧度    2 * Math.PI是一个整圆
     * number counterclockwise 弧度的方向是否是逆时针
     */
    ctx.arc(50, 50, 100, 0, 2 * Math.PI);
    // 剪切区域
    ctx.clip();
    /**
     * 绘制图像到画布
     * imageResource	String	所要绘制的图片资源
     * dx	Number	图像的左上角在目标canvas上 X 轴的位置
     * dy	Number	图像的左上角在目标canvas上 Y 轴的位置
     * dWidth	Number	在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放
     * dHeight	Number	在目标画布上绘制图像的高度，允许对绘制的图像进行缩放
     * sx	Number	源图像的矩形选择框的左上角 X 坐标
     * sy	Number	源图像的矩形选择框的左上角 Y 坐标
     * sWidth	Number	源图像的矩形选择框的宽度
     * sHeight	Number	源图像的矩形选择框的高度
     */
    ctx.drawImage(_this.data.activeInfo.img, 0, 1920 / 10, 1235, 2195, 0, 0, 320 * rpx, 320 / 1080 * 1920 * rpx);
    // 恢复之前保存的绘图上下文
    ctx.restore();
    // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
    ctx.draw(true, () => {
      _this.saveToTempFilePath()
    })
  },
  /**
   * 绘制圆角图片
   */
  roundRectImg(ctx, x, y, w, h, r) {
    let min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    return ctx;
  },
  /**
   * 引导用户进行授权
   */
  bindGetUserInfo(e) {
    let _this = this;
    // console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      _this.friends(e.detail.userInfo.avatarUrl, e.detail.userInfo.nickName);
    } else {
      //用户按了拒绝按钮
    }
  },
  /**
   * 点击分享朋友圈
   */
  friends(avatarUrl, nickName) {
    let _this = this;
    let rpx = _this.data.rpx;
    _this.setData({
      shareCanvas: true
    })
    app.loading();
    let ctx = wx.createCanvasContext('canvas');
    //头像绘制
    ctx.save()
    ctx.beginPath()
    ctx.setLineWidth(5)
    ctx.arc((_this.data.screenWidth - 50) / 2 + 25, 15 + 25, 25, 0, 2 * Math.PI);
    ctx.setStrokeStyle('#ffffff')
    ctx.stroke();
    ctx.closePath();
    ctx.clip()
    ctx.drawImage(avatarUrl, 0, 0, 132, 132, (_this.data.screenWidth - 50) / 2, 15, 50, 50)
    ctx.restore()
    //用户名绘制
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = "#838b93";
    ctx.fillText(nickName, (_this.data.screenWidth - ctx.measureText(nickName).width) / 2, 85)
    ctx.closePath();
    ctx.restore()
    //图片绘制
    let w = 280 * rpx;
    let h = 400 * rpx;
    let x = (_this.data.screenWidth - w) / 2;
    let y = 102;
    let r = 20;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.clip();
    // wx.getImageInfo({
    //   src: _this.data.activeInfo.img,
    //   success: (res) => {
    //     // 下载成功 即可获取到本地路径
    //     ctx.drawImage(res.path, 0, 1920 / 10, 1235, 2195, x, y, 320 * rpx, 320 / 1080 * 1920 * rpx);
    //   }
    // })
    ctx.drawImage(_this.data.activeInfo.img, 0, 1920 / 10, 1235, 2195, x, y, 320 * rpx, 320 / 1080 * 1920 * rpx);
    ctx.restore();


    //二维码绘制，暂时使用不到，这种使用场景多用于生成带参数的页面的二维码，目前二维码可以固定
    // let APPID = '';
    // let APPSECRET = '';
    // wx.request({
    //   url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    //   success(res) {
    //     wx.request({
    //       url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${res.data.access_token}`,
    //       method: 'POST',
    //       data: {
    //         scene: _this.data.scene,
    //         page: "pages/index/index",
    //         width: 100
    //       },
    //       success(res) {
    //         console.log(wx.arrayBufferToBase64(res.data))
    //         // ctx.save()
    //         // ctx.drawImage('', 0, 0, 132, 132, (_this.data.screenWidth - 50) / 2, 15, 50, 50)
    //         // ctx.restore()
    //       }
    //     })
    //   }
    // })

    //二维码绘制
    ctx.save();
    ctx.drawImage('../../image/qr.png', 0, 0, 505, 505, (_this.data.screenWidth - 80) / 2, 515, 80, 80);
    ctx.restore();
    //二维码文字绘制
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = "#838b93";
    let qr_txt = '长按二维码，使用小程序';
    ctx.fillText(qr_txt, (_this.data.screenWidth - ctx.measureText(qr_txt).width) / 2, 610);
    ctx.closePath();
    ctx.restore();


    ctx.draw(true, () => {
      _this.saveToTempFilePath();
    })
    app.loadend();
  },
  /**
   * 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。在 draw() 回调里调用该方法才能保证图片导出成功。在自定义组件下，第二个参数传入自定义组件实例的 this，以操作组件内 <canvas> 组件。
   */
  saveToTempFilePath() {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: (res) => {
        // console.log(res);
      }
    }, this)
  },
  /**
   * 获取保存权限
   */
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
  /**
   * 保存图片到相册
   */
  saveImageToPhotosAlbumByWX(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      complete: () => {
        // 其他操作
      }
    })
  },
  /**
   * 点击canvas背后蒙层
   */
  maskingTap() {
    let _this = this;
    _this.setData({
      shareCanvas: false
    })
    let ctx = wx.createCanvasContext('canvas');
    ctx.draw(true); //清空画布
  },
  /**
   * 打赏
   */
  rewardPreviewImg() {
    let _this = this;
    _this.menuTap();
    bmobInfo.reward((res) => {
      let arr = [];
      arr.push(res[0].img);
      wx.previewImage({
        urls: arr
      })
    });
  }
})

//http://www.htmleaf.com/Demo/20141023275.html 洗牌图片切换特效
//http://www.htmleaf.com/Demo/20141019230.html 图片堆叠效果
//https://camo.githubusercontent.com/ffd745dc2e0e3f55b31b6e109c3869e58471b36e/68747470733a2f2f63646e2e6472696262626c652e636f6d2f75736572732f313737383634322f73637265656e73686f74732f333832333930302f5f5f5f2d3131312e676966