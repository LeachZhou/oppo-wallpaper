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
    bmobInfo.reward((res) => {
      let arr = [];
      arr.push(res[0].img);
      wx.previewImage({
        urls: arr
      })
    });
  },
  /**
   * 页面跳转
   */
  hrefUrl(e) {
    let _this = this;
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /**
   * 转发功能
   */
  onShareAppMessage(ops) {
    let _this = this;
    let title = '仪式感壁纸，比苹果壁纸还要好看，不信咱们试试？';
    let imageUrl = 'https://ws1.sinaimg.cn/large/e83d3594gy1fvricfp4zlj20dc0aodh6.jpg';
    return {
      title: title,
      path: 'pages/index/index',
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  navigateBack() {
    wx.navigateBack();
  }
})