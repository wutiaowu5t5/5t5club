const mongoose = require("mongoose");
let userSchema = new mongoose.Schema ({
    //用户名
    username:{
        type:String,
        required:true,
    },

    //密码
    password:{
        type:String,
        required:true,
    },

    //头像
    photo:{
        type:String,
        default:"/files/photo/default.jpg"
    }
})


module.exports = mongoose.model("Users",userSchema)