/**
 * 每日一句的数据库操作
 */

//引入和数据库进行连接的代码
const dbutils = require('./DBUtils');

/**
 * 插入数据到数据库的操作
 * @param {*} content 每日一句的内容
 * @param {*} ctime 创建时间
 * @param {*} success 成功时的回调
 */
function insertEveryDay(content, ctime, success) {
  //插入的sql语句
  const sql = "insert into every_day (`content`, `ctime`) values (?, ?)";

  const params = [
    content,
    ctime
  ];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      //如果没有报错， 执行回调函数
      success(res);
    } else {
      //报错
      console.log(err);
    }
  })

  connection.end();
}


/**
 * 查询每日一句， 并按倒序返回一条数据
 */
function queryEveryDay(success) {
  const sql = "select * from every_day order by id desc limit 1;";

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, [], function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  })

  connection.end();
}

module.exports = {
  insertEveryDay,
  queryEveryDay
}