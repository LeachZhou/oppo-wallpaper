let bmobInfo = require('../../utils/bmob-info.js');
let util = require('../../utils/util.js');
bmobInfo.init();

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    allResList: [],
    screenWidth: '',
    screenHeight: '',
    width: 0,
    height: 0,
    scrollTop: 0,
    scrollHeight: 0,
    imgNumEndTips: false,
    day: 0,
    bg: '#000000'
  },
  onLoad() {
    let _this = this; 
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight,
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          width: res.windowWidth / 3,
          height: res.windowWidth / 3 / (1080 / 1920),
        });
      }
    });
    app.loading();
    _this.fecthBmob(_this, () => {
      app.loadend();
    }, 0, true);
  },
  onReady() {},
  fecthBmob(_this, fn, day, PullDown) {
    bmobInfo.index(function(res) {
      // console.log(res);
      if (res.length) {
        let arr = [];
        let isPullDown = PullDown || false;
        if (!isPullDown) {
          if (_this.data.allResList.length) {
            for (let item of _this.data.allResList) {
              arr.push(item);
            }
          }
        }
        let newObj = {};
        newObj.time = res[0].time;
        newObj.data = [...res];
        arr.push(newObj);
        _this.setData({
          allResList: arr
        });
      } else {
        _this.setData({
          imgNumEndTips: true
        });
      }
      fn();
    }, day);
  },
  onPullDownRefresh() {
    let _this = this;
    _this.fecthBmob(_this, () => {
      wx.stopPullDownRefresh();
    }, 0, true);
  },
  onReachBottom() {
    let _this = this;
    let _lastTime = null,
      gapTime = 1500;
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      app.loading();
      _this.setData({
        day: _this.data.day - 1
      });
      _this.fecthBmob(_this, () => {
        app.loadend();
      }, _this.data.day);
      _lastTime = _nowTime
    }
  },
  navigateBack() {
    wx.navigateBack();
  },
  previewImg(e) {
    let _this = this;
    let arr = [];
    for (let i = 0; i < _this.data.allResList.length; i++) {
      for (let j = 0; j < _this.data.allResList[i].data.length; j++) {
        arr.push(_this.data.allResList[i].data[j].img);
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
})