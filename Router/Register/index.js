const express = require('express');
const router = express.Router();
const UserDB = require('../../DB/Users');

//注册提交
router.post("/",async (req, res) =>{
    let {username,password} = req.body

    //验证传过来的数据
    if (
        !/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]{2,8}$/.test(username) ||
        !/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]+$/.test(password)
    ){
        return res.send({
            code:1,
            message:"用户名或密码错误"
        })
    }

    //数据库查找
    let doc = await UserDB.findOne({username})
    if (doc){
        return res.send({
            code:2,
            message:"该用户已存在"
        })
    }

    // 存放在数据库
    await UserDB.create({username,password})

    //返回成功数据
    res.send({
        code:0,
        message:"注册成功"
    })


})

module.exports = router;