const formatTime = (date) => {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " + [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 博客详情区域
const blog_detail = new Vue({
  el: "#blog-detail",
  data: {
    detailBlog: {},
  },
  async created() {
    //如果有值传过来， 那么取出id=?
    const url =
      location.search.indexOf("?") > -1 ?
      location.search.split("?")[1].split("&") :
      "";
    if (url == "") {
      return;
    }
    let id = null;
    for (let i = 0; i < url.length; i++) {
      if (url[i].split("=")[0] == "id") {
        try {
          //发送ajax请求
          id = parseInt(url[i].split("=")[1]);
        } catch (e) {
          console.log("请求错误" + e);
        }
      }
    }

    const result = await axios.get(`/queryBlogById?id=${id}`);

    this.detailBlog = {
      ...result.data.data[0],
      ctime: formatTime(result.data.data[0].ctime * 1000),
    };
  },
});

// 发表评论区域
const send_comment = new Vue({
  el: "#send-comment",
  data: {
    vCode: "", //验证码图片
    rightCode: "", //正确的验证码

    c_name: "", //评论人昵称
    c_email: "", //评论人邮箱
    c_content: "", //评论内容
    c_code: "", //验证码
    c_reply: -1,
    c_reply_name: 0,

    blog_id: "", //博客id

    comments_list: [], //留言数组

    blogCount: 0, //这个文章下面的所有留言
  },
  computed: {
    reply() {
      return function (id, user_name) {
        console.log(user_name);

        this.c_reply = id;
        this.c_reply_name = user_name;
      }
    },
    /**
     * 改变验证码
     */
    changeCode() {
      return function () {
        //请求验证码图片
        axios.get("/queryRandomCode").then((res) => {
          this.vCode = res.data.data.data;
          this.rightCode = res.data.data.text.toLowerCase(); //全部变成小写字母
        });
      };
    },
    /**
     * 发送评论
     */
    sendMes() {
      return function () {
        this.c_code.toLowerCase();

        if (this.c_name == null || this.c_name == "") {
          alert("小可爱您的昵称没有填写哦！");
          return;
        } else if (this.c_email == null || this.c_email == "") {
          alert("小可爱您的邮箱没有填写哦！");
          return;
        } else if (this.c_content == null || this.c_content == "") {
          alert("小可爱您的评论内容没有填写哦！");
          return;
        } else if (this.c_code == null || this.c_code == "") {
          alert("小可爱您的验证码没有填写哦");
          return;
        } else if (this.rightCode != this.c_code) {
          alert("小可爱您的验证码填写不正确哦！");
          this.c_code = ""; //不正确就清空输入框
          return;
        }
        //发送网络请求
        axios
          .post(
            `/insertComment?id=${this.blog_id}&reply=${this.c_reply}&name=${this.c_name}&email=${this.c_email}&content=${this.c_content}&replyname=${this.c_reply_name}`
          )
          .then(
            (res) => {
              if (res.data.status === "success") {
                alert("小可爱您评论成功了哦！");
                //重新请求评论数据
                this.getCommentsList();
                this.getAllComments();

                //把数据都清空
                this.c_name = "";
                this.c_email = "";
                this.c_code = "";
                this.c_content = "";
              }
            },
            (err) => {
              console.log("请求错误" + err);
            }
          );
      };
    },
  },
  created() {
    //还是为了获取id值， 因为需要知道是在哪篇文章下面评论的
    let url =
      location.search.indexOf("?") > -1 ?
      location.search.split("?")[1].split("&") :
      "";

    for (let i = 0; i < url.length; i++) {
      if (url[i].split("=")[0] == "id") {
        try {
          this.blog_id = parseInt(url[i].split("=")[1]);
        } catch (e) {
          console.log(e);
        }
      }
    }

    /**
     * 获取本文章下的留言列表
     */
    this.getCommentsList();

    /**
     * 获取到本文章下面的总留言数量
     */
    this.getAllComments();

    /**
     * 改变验证码
     */
    this.changeCode();
  },

  methods: {
    /**
     * 发送请求获取到所有留言数据
     */
    getCommentsList() {
      axios.get(`/queryCommentsByBId?id=${this.blog_id}`).then(
        (res) => {
          const arr = res.data.data.map(item => {
            return {
              ...item,
              ctime: formatTime(item.ctime * 1000),
              options: item.parent > -1 ? "回复@ " + item.parent_name : ''
            }
          });

          this.comments_list = [
            ...arr
          ]
        },
        (err) => {
          console.log("请求错误" + err);
        }
      );
    },

    /**
     * 获取到这个文章下面的所有的留言数量
     */
    getAllComments() {
      axios.get(`/queryAllCommentsByBId?id=${this.blog_id}`).then(res => {
        this.blogCount = res.data.data[0].count;
      }, err => {
        console.log('请求错误' + err);
      });
    }
  }
});