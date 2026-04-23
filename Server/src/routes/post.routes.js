const express = require("express");
const userModel = require('../models/user.model');
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/create', async (req,res) => {
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message: "unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)  //verify user and requested cookie

        const user = await userModel.findById({
            _id: decoded.id,
        })

        res.status(200).json({
            message: "user authenticated"
        })

    }catch(err){
        return res.status(401).json({
            message: "token not verified"
        })
    }

});

module.exports = router;