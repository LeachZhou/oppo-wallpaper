let bmobInfo = require('../../utils/bmob-info.js');
let util = require('../../utils/util.js');
bmobInfo.init();

//获取应用实例
const app = getApp();

Page({
  data: {

  },
  onLoad() {
    let _this = this;
    _this.uploadWallRes()
  },
  upload: function() {
    let _this = this;
    wx.chooseImage({
      success: function(res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths
        let file;
        for (let item of tempFilePaths) {
          console.log('itemn', item)
          file = Bmob.File('abc.jpg', item);
        }
        file.save().then(res => {
          console.log(res.length);
          console.log(res);
        })
      }
    })
  },
  navigateBack() {
    wx.navigateBack();
  }
})