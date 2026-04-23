const express = require('express');
const router = express.Router();
const authController = require("../controller/auth.controller");

/**
 * POST /api/auth/register
 */
router.post('/register', authController.registerUser);


/**
 * GET /api/auth/get-me
 */
router.get('/get-me', authController.getme);

router.get('/test', (req,res) => {
    console.log("Cookie:", req.cookies);

    res.json({
        message: "test successfull",
        token: req.cookies
    })
})

module.exports = router;