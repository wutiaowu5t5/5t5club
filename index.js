const express = require('express');
const app = express();

//监听端口
app.listen(4000,()=>{
    console.log("服务启动，端口4000");
});

//链接数据库
require("./Middlekey/Mongoose");

//使用中间键
app.use(require("./Middlekey/Cors"));
app.use(require("./Middlekey/Session"));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("./public"))

//监听路由
app.use("/",require("./Router/router"))







