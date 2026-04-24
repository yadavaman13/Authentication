const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


async function registerUser(req,res){
    const {username, email, password} = req.body;

    const userAlreadyExists = await userModel.findOne({
        email
    })

    if(userAlreadyExists){
        res.status(409).json({
            message: "user with same email exists",
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    const refreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,{
        expiresIn: "7d"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   //7 days
    })

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        hashedRefreshToken,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,{
        expiresIn: "15m"
    });


    res.status(201).json({
        message: "User registered successfully",
        user:{
            username,
            email
        },
        accessToken
    });
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
            email: user.email
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

    res.status(200).json({
        message: "success"
    })
}

module.exports = { registerUser, getme, refreshToken, logout };