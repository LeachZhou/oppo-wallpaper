/**
     * 过滤第一个汉字之前的所有符号
     * @param s 字符串
     */
function firstCCF(s) {
  var flag = -1; //第一个汉字开头前面有几个 符号的标识
  var ss = ""; //最终结果
  for (var i = 0; i < s.length; i++) { //原来字符串长度
    if (((s.charAt(i)).charCodeAt(0)) < 255) { //从第一个字符开始,是 标点 就 flag++;
      flag++;
    } else { //碰到一个汉字的时候 直接break 跳出for循环
      break;
    }
  }
  if (flag > -1) { //falg>-1 说明++过了,字符串肯定不是汉字开头
    flag++;
    for (flag; flag <= s.length; flag++) { //如果最开始的字符串 有3个逗号,那么flag应为2,那么 我们需要截取的 就应该是源字符串 下标 3开始,所以上面一行flag++;
      ss += s.charAt(flag);
    }
  } else {
    ss = s;
  }
  return ss;
}

/**
 * 过滤第一个数字之前的所有符号
 * @param s 字符串
 */
function firstNCF(s) {
  var flag = -1; //第一个汉字开头前面有几个 符号的标识
  var ss = ""; //最终结果
  for (var i = 0; i < s.length; i++) { //原来字符串长度
    if (((s.charAt(i)).charCodeAt(0)) > 57 || ((s.charAt(i)).charCodeAt(0)) < 48) { //从第一个字符开始,是 标点 就 flag++;
      flag++;
    } else { //碰到一个汉字的时候 直接break 跳出for循环
      break;
    }
  }
  if (flag > -1) { //falg>-1 说明++过了,字符串肯定不是汉字开头
    flag++;
    for (flag; flag <= s.length; flag++) { //如果最开始的字符串 有3个逗号,那么flag应为2,那么 我们需要截取的 就应该是源字符串 下标 3开始,所以上面一行flag++;
      ss += s.charAt(flag);
    }
  } else {
    ss = s;
  }
  return ss;
}

/**
 * 数组中指定文字分割
 * @param arr 数组
 * @param str 指定字符
 */
function txtArrSplit(arr, str) {
  var jsonArr = [];
  var arrtemp = [];
  var arrtemptxt = [];
  for (var i = 0; i < arr.length; i++) {
    var json = {};
    arrtemptxt.push(arr[i].split(str)[0]);
    arrtemp.push(str + arr[i].split(str)[1]);
    json["before"] = arrtemptxt[i];
    json["after"] = arrtemp[i];
    jsonArr.push(json);
  }
  return jsonArr;
}

/**
 * 对象数组分离 服务于txtArrSplit
 * @param arr 数组
 * @param key 指定键
 * @param str 指定字符
 * @param num 0为指定字符之前的部分 1为之后
 * @param addstr 0为不加指定字符 1为加指定字符
 */
function txtArrSplitJson(arr, key, str, num, addstr) {
  var jsonArr = [];
  if (addstr) {
    for (var i = 0; i < arr.length; i++) {
      jsonArr.push(str + arr[i][key].split(str)[num]);
    }
  } else {
    for (var i = 0; i < arr.length; i++) {
      jsonArr.push(arr[i][key].split(str)[num]);
    }
  }
  return jsonArr;
}

/**
 * 普通数组切割字符
 * @param arr 数组
 * @param str 指定字符
 * @param num 0为指定字符之前的部分 1为之后
 */
function ArrSplit(arr, str, num) {
  var jsonArr = [];
  for (var i = 0; i < arr.length; i++) {
    jsonArr.push(arr[i].split(str)[num]);
  }
  return jsonArr;
}

/**
 * Packet Capture 抓包 获取OPPO数据 处理成可识别json
 * @param res OPPO数据
 */
function oppoWallpaperJson(res) {
  var jsonArr = [];
  if (res.match('@_@')){
    let arrNew = res.split('@_@')[0].split('_');
    var jso = {};
    jso["time"] = arrNew[0];
    jso["title"] = arrNew[1];
    jso["author"] = arrNew[2];
    jso["img"] = arrNew[3];
    jsonArr.push(jso);
  }
  res = res.substring(res.indexOf('@_@') + 3);
  //console.log(res);
  if (res.match('图/')){
    res.replace("图/", "图文/");
  }
  var arr = res.split('@');
  for (var i = 0; i < arr.length; i++) {
    if (!arr[i].match("http://magzinefs")){
      arr.splice(i,1);
    }
  }
  var timeTemp = arr[0].split('.VIEW')[1];
  //console.log(arr[0])
  var timeEnd = firstNCF(timeTemp).substr(0, 8);
  var arrtemp1 = [];
  for (var i = 0; i < arr.length; i++) {
    arrtemp1.push(firstCCF(arr[i]));
  }
  var arrtemp2 = txtArrSplit(arrtemp1, '图文');

  var titleEnd = txtArrSplitJson(arrtemp2, 'before', 'Z', 0);

  var arrtemp3 = txtArrSplitJson(arrtemp2, 'after', 'http://magzinefs', 0, 0);
  var arrtemp4 = txtArrSplitJson(arrtemp2, 'after', 'http://magzinefs', 1, 1);
  var authorEnd = ArrSplit(arrtemp3, 'z', 0);
  var imgEndTemp = ArrSplit(arrtemp4, '?uid=', 0);
  //console.log(arrtemp1)
  //console.log(arrtemp2)
  //console.log(arrtemp3)
  //console.log(arrtemp4)
  // var uid = arrtemp4[0].split('?uid=')[1].substr(0, 32);

  var imgEnd = [];
  for (var i = 0; i < imgEndTemp.length; i++) {
    // imgEnd.push(imgEndTemp[i] + '?uid=' + uid);
    imgEnd.push(imgEndTemp[i]);
  }
  for (var i = 0; i < imgEnd.length; i++) {
    var json = {};
    json["time"] = timeEnd;
    json["title"] = titleEnd[i];
    json["author"] = authorEnd[i];
    json["img"] = imgEnd[i];
    jsonArr.push(json);
  }
  return jsonArr;
}


// 定义数据出口
module.exports = {
  oppoJson: oppoWallpaperJson
}