const express = require("express")
const router = express.Router()
const contactDB = require("../../DB/contact")

//收集信息
router.post("/",async (req, res) => {
    let {name,email,subject,message} = req.body

    //验证数据
    if (!name || !email || !subject || !message) {
        return res.send({
            code: 1,
            message: "数据格式不正确"
        })
    }

    //存数据库
    await contactDB.create({name, email, subject, message})

    res.send({
        code: 0,
        message: "发送成功"
    })
})

module.exports = router