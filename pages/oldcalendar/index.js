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
    bg: [], //每个图片的背景颜色，二维数组
    isImgShow: [], //每个图片是否显示，二维数组,
    startTime: '2018-09-06', //时间选择器可选开始时间
    endTime: '2018-11-06', //时间选择器可选结束时间,
    date: '--年--月--日', //当前时间 
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
    _this.dateFind(_this, (res) => {
      _this.dateSelect(_this, () => {
        setTimeout(() => {
          app.loadend();
        }, 1000)
      }, res);
    });

  },
  onReady() {

  },
  /**
   * 搜索可选时间
   */
  dateFind(_this, fn) {
    bmobInfo.dateFind((res) => {
      _this.setData({
        startTime: res[res.length - 1],
        endTime: res[0],
        date: res[0].split('-')[0] + '年' + res[0].split('-')[1] + '月' + res[0].split('-')[2] + '日'
      })
      fn(res[0]);
    });
  },
  getRGB(min, max) {
    return {
      r: min + Math.round(Math.random() * 1000) % (max - min),
      g: min + Math.round(Math.random() * 1000) % (max - min),
      b: min + Math.round(Math.random() * 1000) % (max - min)
    };
  },
  toHex(val) {
    var hex = '00';
    if (val) {
      hex = parseInt(val).toString(16);
      if (hex.length == 1) {
        hex = '0' + hex;
      }
    }
    return hex;
  },
  /**
   * 随机生成背景颜色
   * num 生成个数
   */
  getColor(num) {
    let _this = this;
    let arr = [];
    for (let i = 0; i < num; i++) {
      let color = {
          r: 0,
          g: 0,
          b: 0
        },
        min = 580,
        max = 720,
        minHex = parseInt('99', 16),
        maxHex = parseInt('DD', 16);
      while (true) {
        color = _this.getRGB(minHex, maxHex);
        if ((color.r + color.g + color.b) >= min && (color.r + color.g + color.b) <= max) {
          break;
        }
      }
      arr.push('#' + _this.toHex(color.r) + _this.toHex(color.g) + _this.toHex(color.b))
    }
    return arr;
  },
  /**
   * 接口请求
   */
  dateSelect(_this, fn, day) {
    bmobInfo.dateSelect((res) => {
      //设置图片背景颜色及图片是否显示数组
      let bgArr = _this.data.bg;
      bgArr.push(_this.getColor(res.length));
      let isImgShowArr = _this.data.isImgShow;
      let objArr = [];
      for (let i in res) {
        objArr.push({
          show: false
        })
      }
      isImgShowArr.push(objArr);
      _this.setData({
        bg: bgArr,
        isImgShow: isImgShowArr
      })
      if (res.length) {
        let arr = [];
        let newObj = {};
        newObj.time = res[0].time;
        newObj.data = [...res];
        arr.push(newObj);
        _this.setData({
          allResList: arr
        }, () => {
          /**
           * 优化浏览方式，防止卡顿崩溃
           */
          let allResList = _this.data.allResList;
          for (let i in allResList) {
            for (let j in allResList[i].data) {
              wx.createIntersectionObserver().relativeToViewport().observe(`.loadImg-${i}-${j}`, (res) => {
                let isImgShowTempArr = _this.data.isImgShow;
                if (res.intersectionRatio > 0) { //相交比例
                  isImgShowTempArr[i][j].show = true;
                  // console.log(`可见-${i}-${j}`)
                } else {
                  isImgShowTempArr[i][j].show = false;
                }
                _this.setData({
                  isImgShow: isImgShowTempArr
                })
              })
            }
          }
        });
      }
      fn();
    }, day);
  },
  /**
   * 时间切换
   */
  bindDateChange: function(e) {
    let _this = this;
    // console.log(e.detail.value)
    _this.setData({
      date: e.detail.value.split('-')[0] + '年' + e.detail.value.split('-')[1] + '月' + e.detail.value.split('-')[2] + '日'
    })
    app.loading();
    _this.dateSelect(_this, () => {
      setTimeout(() => {
        app.loadend();
      }, 1000)
    }, e.detail.value);
  },
  navigateBack() {
    wx.navigateBack();
  },
  previewImg(e) {
    let _this = this;
    let arr = [];
    for (let j = 0; j < _this.data.allResList[0].data.length; j++) {
      arr.push(_this.data.allResList[0].data[j].img);
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  help() {
    wx.showModal({
      title: '友情提示',
      content: '2018年11月07日之前的壁纸将归于旧版，需要请进入旧版查看',
      showCancel: false
    })
  },
  hrefUrl(e) {
    let _this = this;
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})