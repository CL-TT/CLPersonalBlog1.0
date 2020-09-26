const list = new Vue({
  el: '#list',
  data: {
    articleList: []
  },
  async created() {
    const data = await axios.get('/queryAllArticles');

    const result = data.data.data.map(item => {
      return {
        ...item,
        link: '/public/html/blog_detail.html?id=' + item.id
      }
    })

    this.articleList = result;
  },
})