const User = require('../models/User');

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendVerificationCode = async(email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác thực Email',
        text: `Mã xác thực đăng ký tài khoản của bạn là: ${verificationCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Gửi mã xác thực thành công!');
    } catch (error) {
        console.error('Lỗi khi gửi mã xác thực:', error);
    }
}

const getVerificationCode = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được đăng ký, vui lòng chọn Email khác!' });
        }

        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // create new user 
        const newUser = new User({
            email,
            username,
            password: await bcrypt.hash(password, 10),
            verificationCode,
        });
        await newUser.save();

        // Send the verification code to the user's email
        await sendVerificationCode(email, verificationCode);

        return res.status(200).json({ 
            success: true,
            message: 'Thông tin của bạn đã được lưu, vui lòng kiểm tra email để xác thực tài khoản!',
        });
    } catch (error) {
        console.error('Lỗi đăng ký: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
};

const verifyAccount = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const existingUser = await User.findOne({ email, verificationCode });
        if (!existingUser) {
            return res.status(400).json({ message: 'Mã xác thực không hợp lệ' });
        }

        // Update the user's isVerify status to true
        existingUser.isVerify = true;
        existingUser.verificationCode = null;

        await existingUser.save();

        return res.status(200).json({ 
            success: true,
            message: 'Xác thực tài khoản thành công!',
            user: existingUser, 
        });
    } catch (error) {
        console.error('Lỗi xác thực tài khoản: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Tài khoản Email không chính xác' });
        }

        if (!user.isVerify) {
            return res.status(400).json({ message: 'Tài khoản chưa được xác thực' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu chưa chính xác' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.TOKEN_KEY, 
            { expiresIn: '1h' }
        );

        return res.status(200).json({ 
            success: true,
            message: 'Đăng nhập thành công!',
            token,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}

const getForgotPasswordCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }

        if (!existingUser.isVerify) {
            return res.status(400).json({ message: 'Tài khoản chưa được xác thực' });
        }

        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        existingUser.forgotPasswordCode = verificationCode;
        await existingUser.save();

        // Send the verification code to the user's email
        await sendVerificationCode(email, verificationCode);

        return res.status(200).json({ 
            success: true,
            message: 'Mã xác thực đổi mật khẩu đã được gửi đến email của bạn!',
        });
    } catch (error) {
        console.error('Lỗi khi gửi mã xác thực:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}

const resetPassword = async(req, res) => {
    const { email, forgotPasswordCode, newPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email, forgotPasswordCode });
        if (!existingUser) {
            return res.status(400).json({ message: 'Mã xác thực không hợp lệ' });
        }

        // Update the user's password
        existingUser.password = await bcrypt.hash(newPassword, 10);
        existingUser.forgotPasswordCode = null; // Clear the forgot password code

        await existingUser.save();

        return res.status(200).json({ 
            success: true,
            message: 'Đổi mật khẩu thành công!',
        });
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
}

module.exports = {
    getVerificationCode,
    verifyAccount,
    getForgotPasswordCode,
    resetPassword,
    login,
};