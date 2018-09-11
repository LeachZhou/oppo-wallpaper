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
    loading: true
  },
  onLoad() {
    let _this = this;
    //获取屏幕宽高
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          width: res.windowWidth / 3,
          height: res.windowWidth / 3 / (1080 / 1920),
        });
      }
    });

    bmobInfo.index(function(res) {
      console.log(res);
      let obj = {};
      obj.time = res[0].time;
      obj.data = [...res];
      console.log(obj)
      let arr = [];
      arr.push(obj);
      if (res.length) {
        _this.setData({
          loading: false,
          allResList: arr
        });
      }
    });

  },
  navigateBack: function() {
    wx.navigateBack();
  },
  setNavigationBarTitle: function() {
    wx.setNavigationBarTitle({
      title: '日期查询'
    })
  }
})