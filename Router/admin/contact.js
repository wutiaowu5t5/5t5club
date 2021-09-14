const express = require("express")
const router = express.Router()
const contactDB = require("../../DB/contact")

//请求数据
router.get("/",async (req,res) => {
    let doc = await contactDB.find({},{},{sort:{read:1}})

    res.send({
        code:0,
        message:"请求成功",
        data:doc,
    })

})

//更新read
router.post("/read",async (req,res) =>{
    let {id,read} = req.body

    await contactDB.findByIdAndUpdate(id,{read})

    res.send({
        code:0,
        message:"read状态切换完成"
    })
})

module.exports = router