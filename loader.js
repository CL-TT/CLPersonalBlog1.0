/**
 * 对请求地址的操作， 路由信息
 */
const fs = require("fs");

const globalConfig = require("./config");

const controllerSet = [];

//定义一个map集合
let map = new Map();

//读取web文件夹下面的目录名称，  是一个数组形式  ['EveryDayController.js']
const files = fs.readdirSync(globalConfig["web_path"]);


for (let i = 0; i < files.length; i++) {
  //引入这个web文件夹下的对应的  controller.js文件， 这个temp就是对应文件导出的内容
  let temp = require("./" + globalConfig["web_path"] + "/" + files[i]);
  //这个temp是一个对象， 看对象里面是否有path属性，  path是一个map集合  
  //{ path: Map { 'editEveryDay' => [Function: editEveryDay] } }
  if (temp.path) {
    //如果这个集合存在的话  
    for (let [key, value] of temp.path) {
      //loader中的map集合中如果不存在这个key值
      if (map.get(key) == null) {
        //那么就把他保存到map集合中
        map.set(key, value);
      } else {
        throw new Error("url path异常， url:" + key);
      }
    }

    controllerSet.push(temp);
  }
}

module.exports = map;