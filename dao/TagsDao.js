const dbutils = require('./DBUtils');

/**
 * 插入到标签数据库中
 * @param {*} tag  标签名称
 * @param {*} ctime  创建时间
 * @param {*} utime 修改时间
 * @param {*} success 成功回调
 */
function insertTags(tag, ctime, utime, success) {
  const sql = "insert into tags (`tag`, `ctime`, `utime`) values (?, ?, ?)";

  const params = [tag, ctime, utime];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  });

  connection.end();
}


/**
 * 根据标签名查询tag的方法
 * @param {*} tag  标签名
 * @param {*} success 成功回调
 */
function queryTags(tag, success) {
  const sql = "select * from tags where tag = ?;";

  const params = [tag];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  });

  connection.end();
}


/**
 * 查询所有标签名的方法
 * @param {*} success 成功回调
 */
function queryAllTags(success) {
  const sql = "select * from tags";

  const params = [];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  });

  connection.end();
}


module.exports = {
  insertTags,
  queryTags,
  queryAllTags,
}