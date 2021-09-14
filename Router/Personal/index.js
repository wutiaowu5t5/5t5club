const express = require('express');
const router = express.Router();
const UserDB = require('../../DB/Users');

//先鉴定权限
router.use((req,res,next) => {
    if(!req.session.userInfo){
        return res.send({
            code:6,
            message:"用户未登录",

        })
    }
    next()
})

//修改用户的名称
router.post("/name",async (req,res) => {
    let {username} = req.body

    //验证符不符合规则
    if (!/^[\w\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]{2,8}$/.test(username)) {
        return res.send({
            code: 1,
            message: "用户名格式不正确"
        })
    }

    //验证新旧用户名是否一样
    if (username === req.session.userInfo.username) {
        return res.send({
            code: 7,
            message: "新用户名与原用户名相同"
        })
    }

    //找重名
    let doc = await UserDB.findOne({username})

    if (doc){
        return res.send({
            code:2,
            message:"用户已存在"
        })
    }

    // 修改用户名
    await UserDB.findByIdAndUpdate(req.session.userInfo._id,{username})

    //更新session的信息
    req.session.userInfo.username = username

    //给前端反馈
    res.send({
        code:0,
        message:"修改成功",
        data:req.session.userInfo
    })
})

//修改密码
router.post("/password",async(req, res) =>{
    let _id = req.session.userInfo._id
    let {OldPassWord,password} = req.body

    //先验证新密码格式
    if (!/^[\w\[\]\/\\~`|<>,.?;':"{}!@#$%^&*()_+=-]{6,18}$/.test(password)){
        return res.send({
            code: 1,
            message: "密码格式错误"
        })
    }

    //旧密码对不对
    let doc = await UserDB.findById(_id)
    if (doc.password !== OldPassWord){
        return res.send({
            code: 5,
            message: "原密码不正确"
        })
    }

    //新密码与旧密码一样
    if (OldPassWord === password){
        return res.send({
            code: 8,
            message: "新旧密码相同"
        })
    }

    await UserDB.findByIdAndUpdate(_id,{password})
    //销毁session
    req.session.destroy()
    //返回前端信息
    res.send({
        code:0,
        message:"修改成功"
    })

})

//修改头像
router.use("/photo",require("./photo"))


module.exports = router;