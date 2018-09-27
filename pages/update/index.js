var bmobInfo = require('../../utils/bmob-info.js');
var util = require('../../utils/util.js');
bmobInfo.init();

//获取应用实例
const app = getApp();

Page({
  data: {
    list: [],
    activeHeight: -1,
    rpx: 0
  },
  onLoad() {
    let _this = this;
    //获取屏幕宽高
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          rpx: res.windowWidth / 375
        });
      }
    });
    _this.fecthBmob(_this, (res) => {
      let re = [...res];
      let arr = [];
      for (let i = 0; i < re.length; i++) {
        let obj = {};
        obj.version = re[i].version;
        obj.time = re[i].date.iso.split(' ')[0];
        let contentTemp = re[i].content.split(' ');
        let desArr = [];
        for (let j = 0; j < contentTemp.length; j++) {
          let desArrObj = {};
          desArrObj.con = contentTemp[j];
          if (contentTemp[j].match('http')) {
            desArrObj.isImg = true;
          } else {
            desArrObj.isImg = false;
          }
          desArr.push(desArrObj);
        }
        obj.content = [...desArr];
        arr.push(obj);
      }
      console.log(arr)
      _this.setData({
        list: arr,
      }, () => {
        app.loadend();
      });
    })
  },
  /**
   * 数据请求
   */
  fecthBmob(_this, fn, page) {
    app.loading();
    bmobInfo.update((res) => {
      if (res.length) {
        fn(res);
      } else {
        wx.showToast({
          title: '总是空空如也~',
          image: '../../image/blank.png',
          icon: 'none',
          mask: true,
          duration: 5000
        })
      }
    }, page);
  },
  tapList(e) {
    let _this = this;
    let targetIndex = 0; //目标索引 指的是想要打开或者关闭的索引
    let tapIndex = e.currentTarget.dataset.index + 1; //被点击元素索引 +1防止判断时出现0的情况
    let preIndex = wx.getStorageSync('tapListIndex'); //上一个被点击元素索引
    if (preIndex && preIndex > 0 && preIndex == tapIndex) { //如果点击是上一次的元素，则关闭折叠板
      targetIndex = 0;
      wx.removeStorageSync('tapListIndex');
    } else {
      wx.setStorageSync('tapListIndex', tapIndex);
      targetIndex = tapIndex;
    }
    _this.setData({
      activeHeight: targetIndex - 1
    }, () => {
      wx.pageScrollTo({
        scrollTop: e.currentTarget.dataset.index * 75 * _this.data.rpx
      })
    })
  },
  navigateBack() {
    wx.navigateBack();
  }
})