let timer;

let count = 0;

timer = setInterval(function () {
  $(".bar").css("width", count + "%");

  count++;

  if (count > 100) {
    $(".loading-wrap").addClass("finish"); //给加载页面添加一个类

    clearInterval(timer); //清除定时器
  }
}, 20);