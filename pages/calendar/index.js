var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
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
    loading: true,
    scrollTop: 0,
    scrollHeight: 0,
    imgNumEndTips: false,
    day: 0
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
    _this.fecthBmob(_this);
  },
  fecthBmob(_this, day) {
    bmobInfo.index(function(res) {
      // console.log(res);
      if (res.length) {
        let arr = [];
        if (_this.data.allResList.length) {
          for (let item of _this.data.allResList) {
            arr.push(item);
          }
        }
        let newObj = {};
        newObj.time = res[0].time;
        newObj.data = [...res];
        arr.push(newObj);
        _this.setData({
          loading: false,
          allResList: arr
        });
      } else {
        _this.setData({
          imgNumEndTips: true
        });
      }
    }, day);
  },
  //页面滑动到底部
  bindDownLoad() {
    var _this = this;
    _this.setData({
      day: _this.data.day - 1
    });
    _this.fecthBmob(_this, _this.data.day);
  },
  //该方法绑定了页面滚动时的事件,我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  scroll(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  //该方法绑定了页面滑动到顶部的事件,然后做上拉刷新
  topLoad(event) {
    var _this = this;
    _this.setData({
      list: [],
      scrollTop: 0
    });
    _this.fecthBmob(_this);
  },
  navigateBack() {
    wx.navigateBack();
  },
  setNavigationBarTitle() {
    wx.setNavigationBarTitle({
      title: '日期查询'
    })
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