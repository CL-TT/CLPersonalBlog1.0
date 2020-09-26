/**
 * 评论数据库层
 */

const dbutils = require('./DBUtils');

/**
 * 把评论插入到数据库中
 * @param {*} blog_id  博客id
 * @param {*} parent 有没有父级评论
 * @param {*} user_name 评论人名称
 * @param {*} comments 评论内容
 * @param {*} email 评论人邮箱
 * @param {*} ctime 创建时间
 * @param {*} utime 修改时间
 */
function insertComment(blog_id, parent, user_name, comments, email, ctime, utime, parent_name, success) {
  const sql = 'insert into comments (`blog_id`, `parent`, `user_name`, `comments`, `email`, `ctime`, `utime`, `parent_name`) values(?, ?, ?, ?, ?, ?, ?, ?)';

  const params = [blog_id, parent, user_name, comments, email, ctime, utime, parent_name];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  })

  connection.end();
}


/**
 * 根据博客id来获取留言数据
 * @param {*} id  博客id
 * @param {*} success 成功回调
 */
function queryCommentsByBId(id, success) {
  const sql = "select * from comments where blog_id = ?;";

  const params = [id];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  })

  connection.end();
}


/**
 * 根据博客id来获取留言数据的总数量
 * @param {*} id  博客id
 * @param {*} success 成功回调
 */
function queryAllCommentsByBId(id, success) {
  const sql = "select count(1) as count from comments where blog_id = ?;";

  const params = [id];

  const connection = dbutils.createConnection();

  connection.connect();

  connection.query(sql, params, function (err, res) {
    if (err == null) {
      success(res);
    } else {
      console.log(err);
    }
  })

  connection.end();
}


/**
 * 查询最近评论
 * @param {*} success 
 */
function queryHotComment(size, success) {
  const sql = "select * from comments order by id desc limit ?;";

  const params = [size];

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
  insertComment,
  queryCommentsByBId,
  queryAllCommentsByBId,
  queryHotComment
}