const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

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

    const user = await userModel.create({
        username, email, password
    })

    const accessToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,{
        expiresIn: "15 m"
    });

    const refreshToken = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET,{
        expiresIn: "7 d"
    });

    res.cookie("refreshToken", refreshToken);

    res.status(201).json({
        message: "User registered successfully",
        user,
        email,
        password,
        token
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

module.exports = { registerUser, getme };