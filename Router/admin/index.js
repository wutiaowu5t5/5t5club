const express = require("express")
const router = express.Router()

//鉴权
router.use(((req, res,next) => {
    if (!req.session.userInfo || (req.session.userInfo._id !== '60f98f5ce77b432c4c3176d9')) {
        return res.send({
            code: 6,
            message: "您不是管理员"
        })
    }
    next()
}))

//check
router.post('/check',(req, res) => {
    res.send({
        code:0,
        message:"你拥有管理员权限"
    })
})

//友链
router.use("/link",require("./link"))

//文章
router.use("/article",require("./article"))

//联系
router.use("/contact",require("./contact"))



module.exports = router









