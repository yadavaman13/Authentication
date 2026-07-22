const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const otpModel = require("../models/otp.model");

const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sendEmail = require("../services/resend.service.js");
const {generateOtp, getOtpHtml} = require("../utils/util");


async function registerUser(req, res){
    const {username, email, password} = req.body;

    const userAlreadyExists = await userModel.findOne({
        email
    })

    if(userAlreadyExists){
        res.status(409).json({
            message: "user with same email exists",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const otp = generateOtp()
    const html = getOtpHtml(otp)

    const otpHash = await crypto.createHash("sha256").update(otp).digest("hex")

    await otpModel.create({
        email,
        user: user._id,
        otpHash
    })

    await sendEmail(email, "OTP Verification", `Your OTP Code is ${otp}`, html)

    res.status(201).json({
        message: "User registered successfully",
        user:{
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });
}

async function login(req, res){
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(401).json({
            message: "Invalid email"
        })
    }

    if(!user.verified){
        return res.status(401).json({
            message: "User not verified"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(404).json({
            message: "Invalid password"
        })
    }

    const accessToken = jwt.sign({
        id: user._id
    },config.JWT_SECRET,{
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({
        id: user._id
    },config.JWT_SECRET,{
        expiresIn: "7d"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000  //7 days
    });

    res.status(200).json({
        message: "Logged In successfully",
        user:{
            username: user.username,
            email: user.email
        },
        accessToken
    })
}

async function getme(req, res) {
    const token = req.headers.authorization?.split(" ")[ 1 ];

    if(!token){
        res.status(403).json({
            message: "token is not valid"
        })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await userModel.findById(decoded.id)

    res.status(200).json({
        message: "user fetched successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })

}

async function refreshToken(req, res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "token is required"
        })
    }

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        hashedRefreshToken,
        revoked: false
    })

    if(!session){
        return res.status(400).json({
            message: "No session exists for this user"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const accessToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })

    const newRefreshToken = jwt.sign({
        id: decoded.id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const hashedNewRefreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.hashedRefreshToken = hashedNewRefreshToken,
    await session.save()

    res.cookie("newRefreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000  //7 days
    })

    res.status(200).json({
        message: "new access token generated successfully!",
        accessToken
    })
    
}

async function logout(req, res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message: "Invalid Refresh Token"
        })
    }

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        hashedRefreshToken,
        revoked: false
    })

    if(!session){
        return res.status(400).json({
            message: "No session exists"
        })
    }

    session.revoked = true, 
    await session.save()

    res.clearCookie("refreshToken");

    res.status(200).json({
        message: "logged out successfully"
    })
}

async function logoutAll(req, res){
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    },{
        revoked: true
    })

    res.status(200).json({
        message: "Logged out from all devices successfully!"
    })

}

async function verifyEmail(req, res){
    const {otp, email} = req.body;

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if(!otpDoc){
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }

    const user = await userModel.findByIdAndUpdate(otpDoc.user,{
        verified: true
    })

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    return res.status(200).json({
        message: "Email verified successfully",
        user: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    })
}

module.exports = { registerUser, login, getme, refreshToken, logout, logoutAll, verifyEmail };