//引入文件模块
const fs = require('fs');

let globalConfig = {};

//读取server.conf文件里面的内容, 读出来是一个二进制数据
const conf = fs.readFileSync('./server.conf');

//字符串以换行来进行数组的拆分
const configArr = conf.toString().split('\n');

//然后把配置进行一一拆分
//['port=3306', 'serve=222'] => {port: 3306, serve: 222}
configArr.forEach(item => {
  globalConfig[item.split('=')[0].trim()] = item.split('=')[1].trim();
})

module.exports = globalConfig;