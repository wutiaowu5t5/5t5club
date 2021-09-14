const express = require("express")
const router = express.Router()
const linkDB = require("../../DB/link")
const {URL} = require("url")

//添加
router.post("/add", async (req, res) => {

    //去重
    let {origin} = new URL(req.body.home)

    let doc = await linkDB.findOne({home:RegExp(origin)})
    if (doc){
        return res.send({
            code:10,
            message:"该连接已存在"
        })
    }

    //添加到数据库
    await linkDB.create(req.body)

    //返回前端
    res.send({
        code: 0,
        message: "添加成功"
    })

})

//友链修改
router.post("/update", async (req, res) => {
    let {_id, name, home, logo, des} = req.body

    await linkDB.findByIdAndUpdate(_id, {name, home, logo, des})

    res.send({
        code: 0,
        message: "更新完成"
    })
})

//友链删除
router.delete("/delete", async (req, res) => {
    let {_id} = req.body

    await linkDB.findByIdAndDelete(_id)

    res.send({
        code: 0,
        message: "删除成功"
    })
})

module.exports = router