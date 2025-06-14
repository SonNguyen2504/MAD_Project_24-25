const express = require('express');
const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');

const {
    signup,
    verifyAccount,
    login,
    getForgotPasswordCode,
    resetPassword,
    resendVerificationCode,
    resendForgotPasswordCode,
    googleCallback,
} = require('../controllers/AuthController.js');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API liên quan đến xác thực
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản, lấy mã xác thực
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: abc@gmail.com
 *               username:
 *                 type: string
 *                 example: abc
 *               password:
 *                 type: string
 *                 example: 123456
 *               confirmPassword:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/verifyAccount:
 *   post:
 *     summary: Xác minh tài khoản
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            example: abc@gmail.com
 *           verificationCode:
 *            type: string
 *            example: 123456
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/verifyAccount', verifyAccount);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            example: abc@gmail.com
 *           password:
 *            type: string
 *            example: 123456
 *     responses:
 *       content:
 *         application/json:
 *       200:
 *         description: Thành công
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/getPasswordCode:
 *   post:
 *     summary: Lấy mã quên mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            example: abc@gmail.com
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/getPasswordCode', getForgotPasswordCode);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *           type: string
 *           example: abc@gmail.com
 *          forgotPasswordCode:
 *           type: string
 *           example: 123456
 *          newPassword:
 *           type: string
 *           example: 123456789
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/resetPassword', resetPassword);

/**
 * @swagger
 * /api/auth/resendVerificationCode:
 *   post:
 *     summary: Gửi lại mã xác thực
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            example: abc@gmail.com
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/resendVerificationCode', resendVerificationCode);

/**
 * @swagger
 * /api/auth/resendForgotPasswordCode:
 *   post:
 *     summary: Gửi lại mã quên mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           email:
 *            type: string
 *            example: abc@gmail.com
 *     responses:
 *       200:
 *         description: Thành công
 */
router.post('/resendForgotPasswordCode', resendForgotPasswordCode);

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
    }),
    googleCallback
);

module.exports = router;
