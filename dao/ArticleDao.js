/**
 * 文章的编辑，写入数据和从数据库中查询
 */

const dbutils = require('./DBUtils');

/**
 * 把文章插入到数据库
 * @param {*} title  文章标题
 * @param {*} content 文章内容
 * @param {*} views 浏览次数
 * @param {*} tags 标签名
 * @param {*} ctime 创建时间
 * @param {*} utime 修改时间
 */
function insertArticle(title, content, views, tags, ctime, utime, success) {
  const sql = "insert into blog (`title`, `content`, `views`, `tags`, `ctime`, `utime`) values (?, ?, ?, ?, ?, ?)";

  const params = [title, content, views, tags, ctime, utime];

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
 * 分页查询查询文章数据
 * @param {*} page 当前页数
 * @param {*} pageSize 每次请求的数量
 * @param {*} success 成功回调
 */
function queryBlogByPage(page, pageSize, success) {
  const sql = "select * from blog order by id desc limit ?, ?;";

  const params = [page, pageSize];

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
 * 查询文章的总数量
 * @param {*} success 
 */
function queryBlogAll(success) {
  const sql = "select count(1) as count from blog;";

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


/**
 * 根据文章id查询具体文章内容
 * @param {*} id 
 * @param {*} success 
 */
function queryBlogById(id, success) {
  const sql = "select * from blog where id = ?";

  const params = [id];

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
 * 查询文章的总数量
 * @param {*} success 
 */
function queryAllArticles(success) {
  const sql = "select * from blog;";

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


/**
 * 查询最近热门文章
 * @param {*} success 
 */
function queryHotBlog(size, success) {
  const sql = "select * from blog order by views desc limit ?;";

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

/**
 * 增加浏览次数
 * @param {*} success 
 */
function updateViews(id, success) {
  const sql = "update blog set views = views + 1 where id = ?;";

  const params = [id];

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
};


/**
 * 根据关键字来查询文章
 * @param {*} search 关键字
 * @param {*} success 
 */
function search_Blog(search, success) {
  const sql = "select * from blog where title like concat(concat('%', ?), '%') or content like concat(concat('%', ?), '%');";
  let params = [search, search];
  let connection = dbutils.createConnection();
  connection.connect();
  connection.query(sql, params, function (error, result) {
    if (error == null) {
      success(result);
    } else {
      console.log(error);
    }
  });
  connection.end();
};


/**
 * 搜索文章的总数量
 * @param {*} search 搜索关键字
 * @param {*} success 
 */
function queryBlogBySearchCount(search, success) {
  const sql = "select count(1) from blog where title like \"%?%\" or content like \"%?%\";";
  let params = [search, search];
  let connection = dbutils.createConnection();
  connection.connect();
  connection.query(sql, params, function (error, result) {
    if (error == null) {
      success(result);
    } else {
      console.log(error);
    }
  });
  connection.end();
}


module.exports = {
  insertArticle,
  queryBlogByPage,
  queryBlogAll,
  queryBlogById,
  queryAllArticles,
  updateViews,
  queryHotBlog,
  search_Blog,
  queryBlogBySearchCount
}