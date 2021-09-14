const express = require("express")
const router = express.Router()
const messageDB = require("../../DB/message")
const linkDB = require("../../DB/link")
const articleDB = require("../../DB/article")
const visitorDB = require("../../DB/visitor")

//请求留言
router.get("/message",async (req,res) => {
    let doc = await messageDB
        .find({},{},{sort: {date: -1}})
        .populate('author', {pass: 0, __v: 0})
        .populate('children.author', {pass: 0, __v: 0})
        .populate('children.replyUser', {pass: 0, __v: 0})

    res.send({
        code:0,
        message:"请求成功",
        data:doc
    })
})

//请求友链
router.get("/link", async (req, res) => {
    let data = await linkDB.find()
    res.send({
        code: 0,
        message: "请求完成",
        data
    })
})

//请求文章
router.get("/article", async (req, res) => {
    let doc = await articleDB.find({},{},{sort: {pv: -1}})

    res.send({
        code: 0,
        message: "请求成功",
        data: doc
    })
})

//请求id对应的文章
router.get("/articleID", async (req, res) => {
    let {id} = req.query

    let doc = null
    try{
        doc = await articleDB.findById(id)

        if (doc){
            //观看+1
            await articleDB.findByIdAndUpdate(id, {$inc: {pv: 1}})

            res.send({
                code: 0,
                message: "查询成功",
                data: doc
            })
        } else {
            res.send({
                code: 11,
                message: "文章查询错误"
            })
        }

    }catch (e) {
        if (e.kind === "ObjectId") {
            res.send({
                code: 11,
                message: "文章查询失败"
            })
        } else {
            res.send({
                code: 4,
                message: "服务器错误，请稍后再试"
            })
        }
    }

})


//请求visitor
router.get("/visitor", async (req,res) => {
    let doc = await visitorDB
        .find({},{},{sort:{date:-1}})
        .populate("visitor",{pass: 0, __v: 0})

    res.send({
        code: 0,
        message: "请求完成",
        data: doc
    })
})


module.exports = router