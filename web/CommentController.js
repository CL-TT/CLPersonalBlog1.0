/**
 * 评论控制层
 */

const timeUtils = require("../utils/timeUtils");

const writeUtils = require("../utils/writeUtils");

const url = require("url");

const map = new Map();

//评论的dao
const CommentsDao = require("../dao/CommentDao");

//引入这个验证码的库
const svg_captcha = require("svg-captcha");

/**
 * 把评论插入到数据库中
 */
function insert_Comment(request, response) {
  let params = url.parse(request.url, true).query;
  const {
    id,
    reply,
    name,
    content,
    email,
    replyname
  } = params;
  CommentsDao.insertComment(
    parseInt(id),
    parseInt(reply),
    name,
    content,
    email,
    timeUtils.getNow(),
    timeUtils.getNow(),
    replyname,
    function (result) {
      response.writeHead(200);
      response.write(writeUtils.writeResult("success", "插入成功", null));
      response.end();
    }
  );
}

/**
 * 请求验证码
 */
function queryRandomCode(request, response) {
  const img = svg_captcha.create({
    fontSize: 50,
    width: 100,
    height: 34
  });
  response.writeHead(200);
  response.write(writeUtils.writeResult("success", "请求成功", img));
  response.end();
}


/**
 * 根据博客id来获取留言数据
 * @param {*} request 
 * @param {*} response 
 */
function queryCommentsByBId(request, response) {
  let params = url.parse(request.url, true).query;

  CommentsDao.queryCommentsByBId(parseInt(params.id), function (result) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', result));
    response.end();
  })
}


/**
 * 根据博客id来获取留言数据的总数量
 * @param {*} request 
 * @param {*} response 
 */
function query_AllCommentsByBId(request, response) {
  let params = url.parse(request.url, true).query;

  CommentsDao.queryAllCommentsByBId(parseInt(params.id), function (result) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', result));
    response.end();
  })
}


/**
 * 查询最近评论， 根据id进行排序， 然后倒序
 * 一次查询5条
 * @param {*} request 
 * @param {*} response 
 */
function query_HotComment(request, response) {
  CommentsDao.queryHotComment(5, function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();
  })
}


map.set("insert_Comment", insert_Comment);

map.set("queryRandomCode", queryRandomCode);

map.set("queryCommentsByBId", queryCommentsByBId);

map.set("query_AllCommentsByBId", query_AllCommentsByBId);

map.set("query_HotComment", query_HotComment);

module.exports.path = map;