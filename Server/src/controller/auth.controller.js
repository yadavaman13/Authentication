const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt")


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

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

    const sessions = await sessionModel.create({
        user: user._id,
        hashedRefreshToken,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: sessions._id
    }, config.JWT_SECRET,{
        expiresIn: "15m"
    });


    res.status(201).json({
        message: "User registered successfully",
        username,
        email,
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
        res.status(401).json({
            message: "token is required"
        })
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

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

module.exports = { registerUser, getme, refreshToken };