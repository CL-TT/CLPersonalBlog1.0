const express = require("express");

const loader = require("./loader");

//引入配置文件
const globalConfig = require("./config");

const app = new express();

//使用静态资源
app.use("/public/", express.static("./public/"));


/**
 * 监听post请求，  请求地址为 /editEveryDay
 * 第二个参数是一个function,  是controller层中的everyDay中的函数
 * loader.get('editEveryDay) => 
 * function editEveryDay(request, response) {
   request.on('data', function (data) {
     console.log(data);
   })
 }
 */
app.post("/editEveryDay", loader.get("editEveryDay"));

/**
 * 监听get请求，  请求地址为 /queryEveryDay
 * 为了获取每日一句的数据
 */
app.get("/queryEveryDay", loader.get("query_EveryDay"));

/**
 * 监听post请求
 * 文章插入到数据库
 */
app.post("/editArticle", loader.get("editArticle"));

/**
 * 监听post请求
 * 分页查询，查询文章数据
 */
app.get("/queryBlogByPage", loader.get("query_BlogByPage"));

/**
 * 监听post请求
 * 查询总的文章数量
 */
app.get("/queryBlogAll", loader.get("query_BlogAll"));

/**
 * 监听get请求
 * 根据文章id查询具体文章
 */
app.get("/queryBlogById", loader.get("query_BlogById"));

/**
 * 监听post请求
 * 把评论内容插入到数据库中
 */
app.post("/insertComment", loader.get("insert_Comment"));

/**
 * 监听get请求
 * 获取到验证码图片
 */
app.get("/queryRandomCode", loader.get("queryRandomCode"));

/**
 * 监听get请求
 * 根据博客id来获取留言数据
 */
app.get("/queryCommentsByBId", loader.get("queryCommentsByBId"));


/**
 * 监听get请求
 * 根据博客id来获取总的留言数量
 */
app.get("/queryAllCommentsByBId", loader.get("query_AllCommentsByBId"));


/**
 * 监听get请求
 * 请求所有的博客文章
 */
app.get('/queryAllArticles', loader.get("query_AllArticles"));


/**
 * 监听get请求
 * 请求所有的标签
 */
app.get('/queryAllTags', loader.get("query_AllTags"));


/**
 * 监听get请求
 * 获取最近热门文章 
 */
app.get('/queryHotBlog', loader.get("query_HotBlog"));


/**
 * 监听get请求
 * 获取最近评论
 */
app.get('/queryHotComment', loader.get("query_HotComment"));


/**
 * 监听get请求
 * 获取指定tag名称的博客文章
 */
app.get('/queryByTagCount', loader.get('query_ByTagCount'));



/**
 * 监听get请求
 * 
 */
app.get('/queryByTags', loader.get('query_ByTags'));


/**
 * 监听get请求
 * 搜索框事件
 */
app.get('/searchBlog', loader.get('search_Blog'));


/**
 * 监听get请求
 * 搜索框事件文章的总数量
 */
app.get('/queryBlogBySearchCount', loader.get('query_BlogBySearchCount'));

app.listen(globalConfig.port, function () {
  console.log("成功开启服务");
});