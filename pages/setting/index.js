var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
bmobInfo.init();

//获取应用实例
const app = getApp();

Page({
  data: {
    uploadPwdModalHidden: true,
    uploadPwd: ''
  },
  onLoad() {},
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
   * 点击上传资源
   */
  uploadpwd() {
    let _this = this;
    _this.setData({
      uploadPwdModalHidden: false
    })
  },
  /**
   * 点击上传资源确定
   */
  confirmM: function(e) {
    let _this = this;
    bmobInfo.uploadpwd((res) => {
      if (res[0].pwd == md5.hex_md5(_this.data.uploadPwd)) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url
        })
      }
      _this.cancelM();
    });
  },
  /**
   * 点击取消
   */
  cancelM: function(e) {
    let _this = this;
    _this.setData({
      uploadPwdModalHidden: true,
      uploadPwd: ''
    })
  },
  /**
   * 绑定input的值
   */
  uploadPwdInput: function(e) {
    this.setData({
      uploadPwd: e.detail.value
    })
  },
  navigateBack() {
    wx.navigateBack();
  }
})