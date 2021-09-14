const mongoose = require("mongoose")

let messageSchema = new mongoose.Schema({
    //留言内容
    text: {
        type: String,
        required: true
    },

    //日期
    date: {
        type: Number,
        default: Date.now
    },

    //点赞
    likes: [
        {type: mongoose.Schema.Types.ObjectId}
    ],

    //用户
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },

    //子评论
    children: [
        {
            //留言内容
            text: String,
            //用户
            author: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
            //点赞
            likes: [{type: mongoose.Schema.Types.ObjectId}],
            //日期
            date: {type: Number, default: Date.now},
            //回复谁
            replyUser: {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
        }
    ]
})

module.exports = mongoose.model("message",messageSchema)