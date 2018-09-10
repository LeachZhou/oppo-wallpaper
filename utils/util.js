/**
 * 时间格式化
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 数组扁平化
 */
const flatten = (arr) => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
/**
 * 函数节流
 */
const throttle = (fn, delay) => {
  let args = arguments,
    context = this,
    timer = null,
    remaining = 0,
    previous = new Date();

  return function() {
    let now = new Date();
    remaining = now - previous;

    if (remaining >= delay) {
      if (timer) {
        clearTimeout(timer);
      }

      fn.apply(context, args);
      previous = now;
    } else {
      if (!timer) {
        timer = setTimeout(function() {
          fn.apply(context, args);
          previous = new Date();
        }, delay - remaining);
      }
    }
  };
}

module.exports = {
  formatTime: formatTime,
  flatten: flatten,
  throttle: throttle
}