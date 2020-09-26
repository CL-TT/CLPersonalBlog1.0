const dbutils = require('./DBUtils');

/**
 * 插入到标签映射数据库中
 * @param {*} tag_id  标签id
 * @param {*} blog_id 文章id
 * @param {*} ctime  创建时间
 * @param {*} utime 修改时间
 * @param {*} success 成功回调
 */
function insertTagsMap(tag_id, blog_id, ctime, utime, success) {
  const sql = "insert into tag_blog_mapping (`tag_id`, `blog_id`, `ctime`, `utime`) values (?, ?, ?, ?)";

  const params = [tag_id, blog_id, ctime, utime];

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
 * 根据标签id来获取， blog_id
 * @param {*} success 成功回调
 */
function queryByTags(tag_id, page, pageSize, success) {
  const sql = "select * from tag_blog_mapping where tag_id = ? limit ?, ?;";

  const params = [tag_id, page, pageSize];

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


function queryByTagCount(tag_id, success) {
  const sql = "select count(1) as count from tag_blog_mapping where tag_id = ?;";

  const params = [tag_id];

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
  insertTagsMap,
  queryByTags,
  queryByTagCount
}