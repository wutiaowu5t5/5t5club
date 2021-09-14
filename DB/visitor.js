const mongoose = require("mongoose")
let Schema = mongoose.Schema
let visitorSchema = new Schema({

    //存用户id
    visitor: {
        type: Schema.Types.ObjectId,
        ref:"Users",
        required: true
    },

    //日期
    date: {
        type: Number,
        default: Date.now
    }
})

module.exports = mongoose.model("visitor", visitorSchema)







