var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
bmobInfo.init();

//获取应用实例
const app = getApp();

Page({
  data: {

  },
  onLoad() {
    let _this = this;
  },
  /**
   * 数据请求
   */
  // fecthBmob(_this, fn) {
  //   bmobInfo.reward((res) => {
  //     fn(res);
  //   });
  // },
  // previewImg(e) {
  //   let _this = this;
  //   let arr = [];
  //   arr.push(e.currentTarget.dataset.src);
  //   wx.previewImage({
  //     urls: arr // 需要预览的图片http链接列表
  //   })
  // },
  navigateBack() {
    wx.navigateBack();
  }
})