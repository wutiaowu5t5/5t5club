const express = require('express');
const router = express.Router();
const UserDB = require('../../DB/Users');
const visitorDB = require('../../DB/visitor');

//添加访客
async function addVisitor(req) {
    try{
        let userID = req.session.userInfo._id

        //先看存没存当前用户
        let doc = await visitorDB.findOne({visitor: userID})
        if (doc) {
            //已经存在该用户访问记录
            await visitorDB.findOneAndUpdate({visitor: userID}, {date: Date.now()})
        } else {
            //不存在该用户访问记录
            await visitorDB.create({
                visitor: userID
            })
        }
    }catch (e) {}
}

//登录
router.post("/", async (req,res) =>{
    let {username,password} = req.body;

    //验证数据格式
    if (!/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]{2,8}$/.test(username) || !/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]+$/.test(password)) {
        return res.send({
            code: 1,
            message: "数据格式错误"
        })
    }

    //验证用户名还有密码
    let doc = await UserDB.findOne({username});

    //如果用户不存在
    if (!doc){
        return res.send({
            code:3,
            message:"该用户不存在"
        })
    }

    //验证密码
    if (doc.password !== password){
        return res.send({
            code:5,
            message:"密码错误"
        })
    }

    //登陆成功
    let userInfo = {
        username : doc.username,
        _id : doc._id,
        photo : doc.photo
    }
    req.session.userInfo = userInfo
    //更新visitor
    addVisitor(req)

    //设置session
    req.session.userInfo = userInfo;

    //返回给前端
    res.send({
        code:0,
        message:"登陆成功",
        data: userInfo
    })

})

//检查登录
router.post("/check", (req,res) =>{
    let data = req.session.userInfo;

    if (data){
        //更新visitor
        addVisitor(req)
        //登陆过了
        res.send({
            code:0,
            message:"已经登录",
            data
        })
    }else {
        //没有登陆
        res.send({
            code:1,
            message:"未登录",
            data:{}
        })
    }
})


//退出
router.post("/out", (req,res)=>{
    req.session.destroy();
    res.send({
        code:0,
        message:"退出登录完成"
    })
})


module.exports = router;