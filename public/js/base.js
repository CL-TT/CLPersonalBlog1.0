/**
 * 基础的js逻辑， 包含着随机标签云， 最近热门， 最近评论
 */

/**
 * 随机标签云
 */
const randomTags = new Vue({
  el: '#randomTags',
  data: {
    tags: []
  },
  computed: {
    /**
     * 随机颜色
     */
    randomColor() {
      return function () {
        const red = Math.random() * 255 + 50;
        const blue = Math.random() * 255 + 50;
        const green = Math.random() * 255 + 50;

        return `rgb(${red}, ${blue}, ${green})`;
      }
    },

    randomSize() {
      return function () {
        const size = (Math.random() * 14 + 12) + 'px';
        return size;
      }
    }
  },
  async created() {
    const data = await axios.get('/queryAllTags');

    const result = data.data.data.map(item => {
      return {
        tag: item.tag,
        link: "/public/html/home.html?tag=" + item.id
      }
    })

    this.tags = result;
  },
})

/**
 * 最近热门
 */
const rotTitle = new Vue({
  el: '#hot',
  data: {
    hotList: [{
        title: '你好呀',
        link: ''
      },
      {
        title: '你好呀',
        link: ''
      },
      {
        title: '你好呀',
        link: ''
      }
    ]
  },
  async created() {
    const data = await axios.get('/queryHotBlog');

    const result = data.data.data.
    map(item => {
      return {
        title: item.title,
        link: '/public/html/blog_detail.html?id=' + item.id
      }
    })

    this.hotList = result;
  }
});


/**
 * 最近评论
 */
const comment = new Vue({
  el: '#comment',
  data: {
    commentList: []
  },
  async created() {
    const data = await axios.get('/queryHotComment');

    const result = data.data.data.map(item => {
      return {
        name: item.user_name,
        date: formatTime(item.ctime * 1000),
        comment: item.comments
      }
    })

    this.commentList = result;
  }
})