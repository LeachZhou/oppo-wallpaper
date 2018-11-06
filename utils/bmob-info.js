var Bmob = require('Bmob-1.6.3.min.js');
var oppoJson = require('oppoJson.js');
var util = require('util.js');
var dayjs = require('dayjs.min.js');

module.exports = {
  init() {
    Bmob.initialize("6e810df9cb70d3817a543d38dce1408e", "0a764f82abda7265092c87ed19dca294");
  },
  oppoJson: oppoJson.oppoJson,
  /**
   * 首页请求
   * fn 回调函数
   * day 日期 0为当前 1为后一天 -1位前一天
   */
  index(fn, day) {
    let now = day || 0;
    const query = Bmob.Query('wallpaper');
    query.limit(1);
    query.order("-createdAt");
    query.find().then((res) => {
      query.order("-wallpaperTime");
      let nextTime = {
        "__type": "Date",
        "iso": dayjs(res[0].wallpaperTime.iso).add(now + 1, 'day').format('YYYY-MM-DD HH:mm:ss').split(' ')[0] + ' 00:00:00'
      }
      let nowTime = {
        "__type": "Date",
        "iso": dayjs(res[0].wallpaperTime.iso).add(now, 'day').format('YYYY-MM-DD HH:mm:ss').split(' ')[0] + ' 00:00:00'
      }
      query.equalTo("wallpaperTime", "<", nextTime);
      query.equalTo("wallpaperTime", ">", nowTime);
      query.find().then(res => {
        let arr = [];
        for (let item of res) {
          arr.push(oppoJson.oppoJson(item.wallpaperData));
        }
        let flatArr = util.flatten(arr);
        for (let i = 0; i < flatArr.length; i++) {
          if (flatArr[i].author.match('undefine') || flatArr[i].img.match('undefine')) { //如果作者或者图片里面有undefined，则删除
            flatArr.splice(i, 1);
          } else {
            if (flatArr[i].title.match('R')) { //如果标题里面包含“R"
              let index = flatArr[i].title.indexOf('R'); //获取R的位置
              if (flatArr[i].title[index + 2]) { //R往后是否有2个字符的位置
                // console.log(flatArr[i].title[index] + flatArr[i].title[index + 1]);
                // if ((flatArr[i].title[index + 2]).match(/[\u4e00-\u9fa5]/)) { //往后的2个位置是否是汉字
                let str = flatArr[i].title.substr(0, index) + ' ' + flatArr[i].title.substr(index + 2); //如果是汉字把R和R后面的一个字符删掉，前后进行拼接
                flatArr[i].title = str;
                // }
              }
              if (flatArr[i].title[flatArr[i].title.length - 1] == 'R') {
                flatArr[i].title = flatArr[i].title.substr(0, index - 1);
              }
            }
          }
        }
        fn(flatArr);
      }).catch((res) => {
        console.log(res)
        wx.showToast({
          title: '请求失败',
          image: '../../image/err.png',
          icon: 'none',
          mask: true,
          duration: 5000
        })
      })
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        title: '请求失败',
        image: '../../image/err.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    })
  },
  /**
   * 可选时间查找
   */
  dateFind(fn, day) {
    let now = dayjs(day);
    const query = Bmob.Query('wallpaper');
    query.order("-wallpaperTime");
    query.find().then(res => {
      let Arr = [];
      for(let i in res){
        Arr.push(res[i].wallpaperTime.iso.split(' ')[0])
      }
      fn([...new Set(Arr)]);
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        title: '请求失败',
        image: '../../image/err.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    })
  },
  /**
   * 日期查找
   * fn 回调函数
   * day 日期 格式：2018-11-11
   */
  dateSelect(fn, day) {
    let now = dayjs(day);
    const query = Bmob.Query('wallpaper');
    query.order("-wallpaperTime");
    let nowTime = {
      "__type": "Date",
      "iso": now.format('YYYY-MM-DD HH:mm:ss').split(' ')[0] + ' 00:00:00'
    }
    let nextTime = {
      "__type": "Date",
      "iso": now.add(1, 'day').format('YYYY-MM-DD HH:mm:ss').split(' ')[0] + ' 00:00:00'
    }
    query.equalTo("wallpaperTime", ">", nowTime);
    query.equalTo("wallpaperTime", "<", nextTime);
    query.find().then(res => {
      let arr = [];
      for (let item of res) {
        arr.push(oppoJson.oppoJson(item.wallpaperData));
      }
      let flatArr = util.flatten(arr);
      for (let i = 0; i < flatArr.length; i++) {
        if (flatArr[i].author.match('undefine') || flatArr[i].img.match('undefine')) { //如果作者或者图片里面有undefined，则删除
          flatArr.splice(i, 1);
        } else {
          if (flatArr[i].title.match('R')) { //如果标题里面包含“R"
            let index = flatArr[i].title.indexOf('R'); //获取R的位置
            if (flatArr[i].title[index + 2]) { //R往后是否有2个字符的位置
              // console.log(flatArr[i].title[index] + flatArr[i].title[index + 1]);
              // if ((flatArr[i].title[index + 2]).match(/[\u4e00-\u9fa5]/)) { //往后的2个位置是否是汉字
              let str = flatArr[i].title.substr(0, index) + ' ' + flatArr[i].title.substr(index + 2); //如果是汉字把R和R后面的一个字符删掉，前后进行拼接
              flatArr[i].title = str;
              // }
            }
            if (flatArr[i].title[flatArr[i].title.length - 1] == 'R') {
              flatArr[i].title = flatArr[i].title.substr(0, index - 1);
            }
          }
        }
      }
      fn(flatArr);
    }).catch((res) => {
      console.log(res)
      wx.showToast({
        title: '请求失败',
        image: '../../image/err.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    })

  },
  /**
   * 更新
   */
  update(fn, page) {
    const query = Bmob.Query('update');
    query.order("-date");
    query.find().then((res) => {
      fn(res);
    }).catch((res) => {
      wx.showToast({
        title: '请求失败',
        image: '../../image/err.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    })
  },
  /**
   * 打赏
   */
  reward(fn) {
    const query = Bmob.Query('sponsor');
    query.find().then((res) => {
      fn(res);
    }).catch((res) => {
      wx.showToast({
        title: '请求失败',
        image: '../../image/err.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    })
  },
  /**
   * 微信群
   */
  wxgroup(fn) {
    const query = Bmob.Query('wxgroup');
    query.find().then((res) => {
      fn(res);
    }).catch((res) => {
      wx.showToast({
        title: '请求失败',
        image: '../../image/err.png',
        icon: 'none',
        mask: true,
        duration: 5000
      })
    })
  }
}