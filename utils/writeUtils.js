/**
 * 封装一个返回数据的方法
 * status:  状态码  'success'
 * msg:  信息
 * data:  数据
 */
function writeResult(status, msg, data) {
  return JSON.stringify({
    status: status,
    msg: msg,
    data: data
  });
}

module.exports = {
  writeResult
}