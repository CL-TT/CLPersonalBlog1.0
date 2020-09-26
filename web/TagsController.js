/**
 * 标签控制层
 */

//引入时间处理的工具类
const timeUtils = require('../utils/timeUtils');

const writeUtils = require('../utils/writeUtils');

const url = require('url');

const TagsDao = require('../dao/TagsDao');

const TagsMappingDao = require('../dao/TagsMapDao');

const ArticleDao = require('../dao/ArticleDao');

const map = new Map();


/**
 * 查询所有的标签名
 * @param {*} request 
 * @param {*} response 
 */
function query_AllTags(request, response) {
  TagsDao.queryAllTags(function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();
  })
}


/**
 * 根据标签名来查询blog_id ,  在映射表中
 * @param {*} request 
 * @param {*} response 
 */
function query_ByTags(request, response) {
  let params = url.parse(request.url, true).query;
  TagsMappingDao.queryByTags(parseInt(params.tag), parseInt(params.page), parseInt(params.pageSize), function (res) {
    for (let i = 0; i < res.length; i++) {
      //根据这个blog_id来查询文章
      ArticleDao.queryBlogById(res[i].blog_id, function (result) {
        response.writeHead(200);
        response.write(writeUtils.writeResult('success', '查询成功', result));
        response.end();
      })
    }
  })
}


/**
 * 查询总数量
 * @param {*} request 
 * @param {*} response 
 */
function query_ByTagCount(request, response) {
  let params = url.parse(request.url, true).query;
  TagsMappingDao.queryByTagCount(parseInt(params.tag), function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();
  })
}



map.set('query_AllTags', query_AllTags);

map.set('query_ByTags', query_ByTags);

map.set("query_ByTagCount", query_ByTagCount);

module.exports.path = map;