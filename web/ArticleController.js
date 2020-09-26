/**
 * 文章控制层
 */


//引入DAO层的方法
const Article = require('../dao/ArticleDao');
const Tags = require('../dao/TagsDao');
const TagsMap = require('../dao/TagsMapDao');

//引入时间处理的工具类
const timeUtils = require('../utils/timeUtils');

const writeUtils = require('../utils/writeUtils');

const url = require('url');
const ArticleDao = require('../dao/ArticleDao');
const {
  mainModule
} = require('process');

const map = new Map();

/**
 * 文章插入到数据库
 * @param {*} request 
 * @param {*} response 
 */
function editArticle(request, response) {
  const params = url.parse(request.url, true).query; //从url地址上传过来的值

  const tags = params.tags.replace(/ /g, "").replace('，', ",");
  //客户端发送过来的数据到达时触发, request监听data事件
  request.on('data', function (data) {
    const result = data.toString().trim();

    Article.insertArticle(params.title, result, 0, tags, timeUtils.getNow(), timeUtils.getNow(), function (res) {
      response.writeHead(200);
      response.write(writeUtils.writeResult('success', '返回成功', null));
      response.end();

      //成功过后,获取到文章id
      const blog_id = res.insertId;
      //获取到所有的标签名称
      const tags_list = tags.split(',');

      for (let i = 0; i < tags_list.length; i++) {
        if (tags_list[i] == '') {
          continue;
        }

        //就把文章id， 和标签名称加入到 tags数据库, 插入之前要判断存不存在， 所以先要查询
        query_Tag(tags_list[i], blog_id);
      }
    })
  })
}

/**
 * 分页查询， 文章数据
 * @param {*} request 
 * @param {*} response 
 */
function query_BlogByPage(request, response) {
  let params = url.parse(request.url, true).query;
  Article.queryBlogByPage(parseInt(params.page), parseInt(params.pageSize), function (result) {
    //对返回的内容进行处理， 如果有图片的话，base64格式的字符串
    for (var i = 0; i < result.length; i++) {
      result[i].content = result[i].content.replace(/<img[\w\W]*">/, "");
      result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g, "");
      result[i].content = result[i].content.substring(0, 300);
    }
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', result));
    response.end();
  });
}

/**
 * 查询文章的总数量
 * @param {*} request 
 * @param {*} response 
 */
function query_BlogAll(request, response) {
  Article.queryBlogAll(function (result) {
    response.writeHead(200);
    response.write(writeUtils.writeResult("success", "查询成功", result));
    response.end();
  });
}

/**
 * 根据id查询具体文章
 * 当点击查看具体的文章时，浏览次数会加1
 * @param {*} request 
 * @param {*} response 
 */
function query_BlogById(request, response) {
  var params = url.parse(request.url, true).query;
  Article.queryBlogById(parseInt(params.id), function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();

    //然后更新浏览次数
    ArticleDao.updateViews(parseInt(params.id), function () {});
  })
}

/**
 * 查询热门文章， 根据浏览次数排序， 然后倒序
 * 一次查询5条
 * @param {*} request 
 * @param {*} response 
 */
function query_HotBlog(request, response) {
  Article.queryHotBlog(5, function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();
  })
}

function query_Tag(tag, blog_id) {
  Tags.queryTags(tag, function (res) {
    if (res == null || res.length == 0) {
      //如果没有返回数据， 那么证明没有查询到， 就需要把数据加入到数据库中
      insert_Tag(tag, blog_id);
    } else {
      //如果查询到了, 插入到映射数据库中
      insert_TagsMap(res[0].id, blog_id);
    }
  })
}

function insert_Tag(tag, blog_id) {
  Tags.insertTags(tag, timeUtils.getNow(), timeUtils.getNow(), function (res) {
    insert_TagsMap(res.insertId, blog_id);
  });
}

function insert_TagsMap(tag_id, blog_id) {
  TagsMap.insertTagsMap(tag_id, blog_id, timeUtils.getNow(), timeUtils.getNow(), function (result) {

  });
}


/**
 * 查询总的文章，并返回
 * @param {*} request 
 * @param {*} response 
 */
function query_AllArticles(request, response) {
  Article.queryAllArticles(function (result) {
    response.writeHead(200);
    response.write(writeUtils.writeResult("success", "查询成功", result));
    response.end();
  });
}


/**
 * 搜索框查询
 * @param {*} request 
 * @param {*} response 
 */
function search_Blog(request, response) {
  let params = url.parse(request.url, true).query;

  //如果关键字不存在
  if (!params.search) {
    response.writeHead(400);
    response.end("must have be search");
    return;
  }

  ArticleDao.search_Blog(params.search, function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();
  })
}


/**
 * 搜索框查询总数量
 * @param {*} request 
 * @param {*} response 
 */
function query_BlogBySearchCount(request, response) {
  let params = url.parse(request.url, true).query;

  //如果关键字不存在
  if (!params.search) {
    response.writeHead(400);
    response.end("must have be search");
    return;
  }

  ArticleDao.queryBlogBySearchCount(params.search, function (res) {
    response.writeHead(200);
    response.write(writeUtils.writeResult('success', '查询成功', res));
    response.end();
  })
}


map.set('editArticle', editArticle);

map.set('query_BlogByPage', query_BlogByPage);

map.set('query_BlogAll', query_BlogAll);

map.set('query_BlogById', query_BlogById);

map.set('query_AllArticles', query_AllArticles);

map.set("query_HotBlog", query_HotBlog);

map.set('search_Blog', search_Blog);

map.set("query_BlogBySearchCount", query_BlogBySearchCount);

module.exports.path = map;