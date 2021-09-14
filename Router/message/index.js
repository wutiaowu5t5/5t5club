const express = require("express")
const router = express.Router()
const messageDB = require("../../DB/message")
const UserDB = require("../../DB/Users")

//鉴权
router.use((req, res, next) => {
    //鉴权
    if (!req.session.userInfo) {
        return res.send({
            code: 6,
            message: "用户未登录"
        })
    }
    next()
})

//留言发表
router.post("/submit", async (req, res) => {

    let {value} = req.body

    //验证数据格式
    if (!value || !value.trim() || value.length > 100) {
        return res.send({
            code: 1,
            message: "留言内容格式错误"
        })
    }

    //存数据库
    let _id = req.session.userInfo._id
    await messageDB.create({
        text: value.trim(),
        author: _id
    })

    res.send({
        code: 0,
        message: "留言成功"
    })

})

//父级点赞
router.post("/like/parent", async (req, res) => {
    //获取评论的id
    let {id} = req.body

    //判断id存不存在
    if (!id) {
        return res.send({
            code: 1,
            message: "id格式不正确"
        })
    }

    //修改数据库
    let _id = req.session.userInfo._id
    let doc = await messageDB.findById(id)
    //检测doc是否存在
    if (!doc) {return res.send({code: 1, message: "id格式不正确"})}

    //判断是否已经点过赞
    if (doc.likes.includes(_id)) {
        //点过赞 -- 删除likes字段里面的当前用户id
        await messageDB.findByIdAndUpdate(id, {$pull: {likes: _id}})
    } else {
        //没点过赞 -- likes字段添加当前用户id
        await messageDB.findByIdAndUpdate(id, {$push: {likes: _id}})
    }

    res.send({
        code: 0,
        message: "操作完成"
    })
})

//子级点赞
router.post("/like/child", async (req, res) => {
    let {pID, cID, cIndex} = req.body
    let parent = await messageDB.findById(pID)
    //验证数据
    if (!parent) {
        return res.send({
            code: 1,
            message: "父级ID错误"
        })
    }
    let child = parent.children.id(cID)
    if (!child) {
        return res.send({
            code: 1,
            message: "子评论ID错误"
        })
    }

    //修改子级的likes
    let userId = req.session.userInfo._id
    if (child.likes.includes(userId)){
        //点赞过了,找到她里面的第cindex个喜欢的id删除
        await messageDB.findByIdAndUpdate(pID,{$pull:{[`children.${cIndex}.likes`]:userId}})
    }else {
        await messageDB.findByIdAndUpdate(pID,{$push:{[`children.${cIndex}.likes`]:userId}})
    }

    res.send({
        code: 0,
        message: "操作成功"
    })

})

//回复提交
router.post("/reply/submit", async (req, res) => {
    let {id, text, replyUser} = req.body

    //判断数据格式
    if (!text) {
        return res.send({
            code: 1,
            message: "回复内容为空"
        })
    }
    if (text.length > 100) {
        return res.send({
            code: 1,
            message: "回复内容过长"
        })
    }

    //验证评论id
    let doc = await messageDB.findById(id)
    if (!doc) {
        return res.send({
            code: 1,
            message: "评论id错误"
        })
    }

    //验证用户id
    let doc2 = await UserDB.findById(replyUser)
    if (!doc2) {
        return res.send({
            code: 3,
            message: "回复的用户id错误"
        })
    }

    //更新数据库
    await messageDB.findByIdAndUpdate(id, {
        $push: {
            children: {
                text,
                author: req.session.userInfo._id,
                replyUser
            }
        }
    })

    res.send({code: 0, message: "回复成功"})
})

module.exports = router