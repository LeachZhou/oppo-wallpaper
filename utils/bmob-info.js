var Bmob = require('Bmob-1.6.3.min.js');
var oppoJson = require('oppoJson.js');
var util = require('util.js');
var dayjs = require('dayjs.min.js');

module.exports = {
  init() {
    Bmob.initialize("6e810df9cb70d3817a543d38dce1408e", "0a764f82abda7265092c87ed19dca294");
  },
  oppoJson: oppoJson.oppoJson,
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
  update(fn, page) {
    page = page || 1; //分页，默认第一页
    const query = Bmob.Query('update');
    let limit = 10 * page;
    let skip = 10 * (page - 1);
    query.limit(limit);
    query.skip(skip);
    query.order("-date");
    query.find().then((res) => {
      fn(res);
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
  }
}