const express = require('express');
const router = express.Router();
const authController = require("../controller/auth.controller");

/**
 * POST /api/auth/register
 */
router.post('/register', authController.registerUser);

/**
 * POST /api/auth/login
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/get-me
 */
router.get('/get-me', authController.getme);

/**
 * GET /api/auth/refresh-token
 */
router.get('/refresh-token', authController.refreshToken);

/**
 * GET /api/auth/logout
 */
router.get('/logout', authController.logout);

/**
 * GET /api/auth/logout-all
 */
router.get('/logout-all', authController.logoutAll);

/**
 * POST /api/auth/verify-email
 */
router.post('/verify-email', authController.verifyEmail);



module.exports = router;