/**
 * 对时间的处理
 */

const getNow = () => {
  const time = new Date().getTime();
  return parseInt(time / 1000);
};


/**
 * 时间格式化
 * @param {*} date 
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = {
  getNow,
  formatTime
}