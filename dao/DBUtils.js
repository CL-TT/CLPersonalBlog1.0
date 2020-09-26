/**
 * 数据库和nodejs进行相关联
 */

const mysql = require('mysql');

/**
 * 创建连接
 */
function createConnection() {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: "3306",
    user: "root",
    password: "caolei",
    database: "my_blog"
  })

  return connection;
}

//返回出去了一个函数
module.exports.createConnection = createConnection;