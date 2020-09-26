/**
 * 每日一句的控制层
 */

//引入DAO层的方法
const EveryDay = require('../dao/EveryDayDao');

//引入时间处理的工具类
const timeUtils = require('../utils/timeUtils');

const writeUtils = require('../utils/writeUtils');


const map = new Map();

function editEveryDay(request, response) {
  //客户端发送过来的数据到达时触发, request监听data事件
  request.on('data', function (data) {
    const result = data.toString().trim();
    EveryDay.insertQuery(result, timeUtils.getNow(), function (res) {
      response.writeHead(200);
      response.write(writeUtils.writeResult('success', '返回成功', null));
      response.end();
    })
  })
}


function query_EveryDay(request, response) {
  EveryDay.queryEveryDay(function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '返回成功', res));
    response.end();
  })
}

map.set('editEveryDay', editEveryDay);

map.set('query_EveryDay', query_EveryDay);

module.exports.path = map;