/**
 * 首页的逻辑处理
 */

const formatTime = date => {
  date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 每日一句区域
 */
const every_day = new Vue({
  el: "#every-day",
  data: {
    content: "",
  },
  computed: {
    getContent() {
      return this.content;
    },
  },
  async created() {
    //发送请求， 向数据库请求数据
    const data = await axios.get("/queryEveryDay");
    this.content = data.data.data[0].content;
  },
});

/**
 * 文章列表区域
 */
const article_list = new Vue({
  el: "#article-list",
  data: {
    page: 1,
    pageSize: 3,
    count: 0,
    pageNumList: [],
    article_list: [],
    tag: null
  },
  computed: {
    jumpPage() {
      return function (page) {
        this.getPage(page, this.pageSize);
        this.page = page;
      }
    },

    getPage() {
      return function (page, pageSize) {
        //这里的情况是为了适应点击标签时， 查询出标签对应的文章
        let url =
          location.search.indexOf("?") > -1 ?
          location.search.split("?")[1].split("&") :
          "";

        for (let i = 0; i < url.length; i++) {
          if (url[i].split("=")[0] == "tag") {
            try {
              this.tag = parseInt(url[i].split("=")[1]);
            } catch (e) {
              console.log(e);
            }
          }
        }

        if (this.tag == null || this.tag == '') {
          //当没点击tag查询时， 就是正常操作
          //发送请求， 从数据库中请求数据, 对文章进行分页查询
          axios.get(`/queryBlogByPage?page=${page - 1}&pageSize=${pageSize}`).then(res => {
            let list = res.data.data.map(item => {
              return {
                id: item.id,
                title: item.title,
                content: item.content,
                ctime: formatTime(item.ctime * 1000),
                views: item.views,
                tags: item.tags,
                link: '/public/html/blog_detail.html?id=' + item.id
              }
            })
            this.article_list = list;
          }, err => {
            console.log('请求错误' + err);
          })

          //发送请求， 从数据库中计算出总的文章数量
          axios.get('/queryBlogAll').then(res => {
            this.count = res.data.data[0].count;
            this.pageTool;
          }, err => {
            console.log('请求错误' + err);
          })
        } else {
          //那就是根据tag_id进行查询
          axios.get(`/queryByTags?page=${page - 1}&pageSize=${pageSize}&tag=${this.tag}`).then(res => {
            let list = res.data.data.map(item => {
              return {
                id: item.id,
                title: item.title,
                content: item.content,
                ctime: formatTime(item.ctime * 1000),
                views: item.views,
                tags: item.tags,
                link: '/public/html/blog_detail.html?id=' + item.id
              }
            })
            this.article_list = list;
          }, err => {
            console.log('请求错误' + err);
          })

          //查询总的数量
          axios.get(`/queryByTagCount?tag=${this.tag}`).then(res => {
            console.log(res);
            this.count = res.data.data[0].count;
            this.pageTool;
          }, err => {
            console.log('请求错误' + err);
          })
        }

      };
    },

    pageTool() {
      const page = this.page;
      const pageSize = this.pageSize;
      const count = this.count;

      let result = [];

      result.push({
        text: '︽',
        page: 1
      });

      if (page > 2) {
        result.push({
          text: page - 2,
          page: page - 2
        });
      }
      if (page > 1) {
        result.push({
          text: page - 1,
          page: page - 1
        });
      }
      result.push({
        text: page,
        page: page
      });
      if (page + 1 <= (count + pageSize - 1) / pageSize) {
        result.push({
          text: page + 1,
          page: page + 1
        });
      }
      if (page + 2 <= (count + pageSize - 1) / pageSize) {
        result.push({
          text: page + 2,
          page: page + 2
        });
      }
      result.push({
        text: "︾",
        page: parseInt((count + pageSize - 1) / pageSize)
      });
      this.pageNumList = result;
      return result;
    }
  },
  created() {
    this.getPage(this.page, this.pageSize);
  },
});


/**
 * 搜索区域
 */
const search = new Vue({
  el: "#search",
  data: {
    searchWord: "",
  },
  methods: {
    search() {
      axios({
        url: `/searchBlog?search=${this.searchWord}`
      }).then(res => {
        let list = res.data.data.map(item => {
          return {
            id: item.id,
            title: item.title,
            content: item.content,
            ctime: formatTime(item.ctime * 1000),
            views: item.views,
            tags: item.tags,
            link: '/public/html/blog_detail.html?id=' + item.id
          }
        })
        article_list.article_list = list;
      }, err => {
        console.log('请求错误' + err);
      });

      axios.get(`/queryBlogBySearchCount?search=${this.search}`).then(res => {
        article_list.count = res.data.data[0].count;
        article_list.pageTool;
      }, err => {
        console.log('请求错误' + err);
      })
    }
  },
})




// then(function (resp) {
//   pageTools.total = resp.data.count;
//   pageTools.nowPage = 1;
//   pageTools.refresh();
//   blogList.list = resp.data.list;
// });