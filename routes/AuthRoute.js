const express = require('express');
const router = express.Router();

const { 
    getVerificationCode, 
    verifyAccount, 
    login, 
    getForgotPasswordCode,
    resetPassword,
} = require('../controllers/AuthController.js');

router.post('/getVerifyCode', getVerificationCode);
router.post('/verifyAccount', verifyAccount); 
router.post('/login', login);
router.post('/getPasswordCode', getForgotPasswordCode);
router.post('/resetPassword', resetPassword);

module.exports = router;