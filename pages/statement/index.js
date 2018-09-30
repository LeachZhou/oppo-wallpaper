var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
bmobInfo.init();

//获取应用实例
const app = getApp();

Page({
  data: {
     
  },
  onLoad() {
     
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
  },
  navigateBack() {
    wx.navigateBack();
  }
})