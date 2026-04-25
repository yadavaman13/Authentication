const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        require: [true, 'email is required']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: [true, 'user is required']
    },
    otpHash:{
        type: String,
        require: [true, 'otp is required']
    }
},{
    timestamps: true
})

const otpModel = mongoose.model("otps", otpSchema);

module.exports = otpModel;