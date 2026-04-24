const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: [true, "user is required"]
    },
    hashedRefreshToken:{
        type: String,
        require: [true, "refresh token is required"]
    },
    ip:{
        type: String,
        require: [true, "ip is required"]
    },
    userAgent:{
        type: String,
        require: [true, "user-agent is required"]
    },
    revoked:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel