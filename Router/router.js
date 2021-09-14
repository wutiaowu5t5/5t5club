const express = require("express");
const router = express.Router();

//注册
router.use("/register",require("./Register/index"));

//登录
router.use("/login", require("./Login/index"));

//个人信息修改
router.use("/personal",require("./Personal/index"));

//管理员
router.use("/adminServer",require("./admin/index"));

//留言
router.use("/message",require("./message/index"))

//各种请求
router.use("/get",require("./getmsg/index"))

//反馈消息
router.use("/contact", require("./contact/index"))

module.exports = router