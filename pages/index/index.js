//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    animationData: {},
    movex: 0,
    movey: 0,
    x: 0,
    y: 0,
    screenHeight: 0,
    screenWidth: 0,
    animation: ''
  },
  onLoad: function() {
    //获取屏幕宽高
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },
  onReady: function() {
    //页面渲染完成
    //实例化一个动画
    this.animation = wx.createAnimation({
      duration: 50,
      timingFunction: 'linear', //均匀
    })
  },
  imageLoad: function(e) {
    var $width, $height;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var _this = this;
    query.select('.change-img').boundingClientRect(function(res) {
      $width = res.width;
      $height = res.height;
      _this.setData({
        y: (_this.data.screenHeight - $height) / 2 * 2, //这里*2为了同步rpx
        x: (_this.data.screenWidth - $width) / 2 * 2
      })
    }).exec();

  },
  startEvent: function(e) {
    //1.获取鼠标点击下去的
    this.setData({
      startx: e.touches[0].pageX,
      starty: e.touches[0].pageY
    })
  },
  moveEvent: function(e) {
    var _this = this;
    //2.鼠标移动的位置
    var pageX = e.touches[0].pageX;
    var pageY = e.touches[0].pageY;
    console.log('pageX: ' + pageX);
    console.log('pageY: ' + pageY);
    var imageLeft = _this.data.x,
      imageTop = _this.data.y;
    var endx = pageX,
      endy = pageY;
    _this.setData({
      x: imageLeft,
      y: imageTop
    })



    // var x, y;
    // //3.记住初始化图片x,y
    // var endx = _this.data.x,
    //   endy = _this.data.y;
    // //4.判断
    // var DistanceX = pageX; //x:当鼠标点击到移动的点之间的距离
    // var DistanceY = pageY; //y:当鼠标点击到移动的点之间的距离
    // if (DistanceX > 0) {
    //   //往右移动 如果当前的值大于等于0时则不移动，否则当前值加上鼠标拖拽的距离
    //   if (endx >= 0) {
    //     x = 0;
    //   } else {
    //     x = endx + DistanceX;
    //   }
    // } else {
    //   //往左移动:x拖拽值大于等于当前的值，说明已经到边上了，就等于拖拽值，否则当前的值加上鼠标拖拽的距离
    //   if (w_x >= endx) {
    //     x = -w_x;
    //   } else {
    //     x = endx + DistanceX;
    //   }
    // }
    // if (DistanceY > 0) {
    //   //往下移动:如果当前的值大于等于0时则不移动，否则当前值加上鼠标拖拽的距离
    //   if (endy >= 0) {
    //     y = 0;
    //   } else {
    //     y = endy + DistanceY;
    //   }
    // } else {
    //   //往上移动:y拖拽值大于等于当前的值，说明已经到边上了，就等于拖拽值，否则当前的值加上鼠标拖拽的距离
    //   if (-endy == h_y || -endy > h_y) {
    //     y = -h_y;
    //   } else {
    //     y = endy + DistanceY;
    //   }
    // }
    // setTimeout(function() {
    //   _this.animation.translate(x, y).step();
    //   _this.setData({
    //     animationData: this.animation.export()
    //   })
    // }.bind(this), 0)

    // _this.setData({
    //   x: x,
    //   y: y,
    // })
    // endx = x;
    // endy = y; //记住这次的图片移动的范围
    // _this.data.startx = pageX;
    // _this.data.starty = pageY; // 每移动一次把上一次的点作为原点
  },
  endEvent: function() {
    clearTimeout(function() {
      this.animation.translate(this.data.x, this.data.y).step();
      this.setData({
        animationData: this.animation.export()
      })
    });
  }


})