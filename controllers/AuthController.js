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

const sendVerificationCode = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác thực Email',
        text: `Mã xác thực đăng ký tài khoản của bạn là: ${verificationCode}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 32px auto; border: 3px solid #34A751; border-radius: 20px; box-shadow: 0 6px 24px rgba(52,167,81,0.13); padding: 36px 28px 28px 28px; background: #fff;">
                <div style="text-align:center;margin-bottom:24px;">
                    <img src="https://res.cloudinary.com/dwox8wsue/image/upload/v1747926592/logo_jfaxd5.jpg" alt="Nutri4Life" style="height:90px;" />
                </div>
                <h1 style="color: #34A751; font-size: 2.1rem; margin-bottom: 12px; text-align:center;">Chào mừng bạn đến với Nutri4Life!</h1>
                <h2 style="color: #222; font-size: 1.3rem; margin-bottom: 10px; text-align:center;">Cảm ơn bạn đã đăng ký tài khoản.</h2>
                <h3 style="font-size: 1.15rem; color: #222; margin-bottom: 8px; text-align:center;">Mã xác thực đăng ký tài khoản của bạn là:</h3>
                <div style="text-align:center;">
                    <div style="background: #f5f5f5; font-size: 2.2rem; font-weight: bold; color: #34A751; letter-spacing: 6px; margin: 18px 0; padding: 16px 36px; border-radius: 10px; border: 3px solid #888; display: inline-block; min-width: 180px; text-align: center;">
                        ${verificationCode}
                    </div>
                </div>
                <p style="color: #222; font-size: 1.05rem; margin-top: 18px; text-align:center;">
                    Vui lòng nhập mã này để hoàn tất quá trình đăng ký.
                </p>
                <hr style="margin: 28px 0 14px 0; border: none; border-top: 2px solid #eee;">
                <p style="font-size: 0.95rem; color: #888; text-align:center;">
                    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Gửi mã xác thực thành công!');
    } catch (error) {
        console.error('Lỗi khi gửi mã xác thực:', error);
    }
}

const sendForgotPasswordCode = async (email, forgotPasswordCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Yêu cầu đổi mật khẩu',
        text: `Mã xác thực yêu cầu đổi mật khẩu của bạn là: ${forgotPasswordCode}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 32px auto; border: 3px solid #f56c6c; border-radius: 20px; box-shadow: 0 6px 24px rgba(245,108,108,0.13); padding: 36px 28px 28px 28px; background: #fff;">
                <div style="text-align:center;margin-bottom:24px;">
                    <img src="https://res.cloudinary.com/dwox8wsue/image/upload/v1747926592/logo_jfaxd5.jpg" alt="Nutri4Life" style="height:90px;" />
                </div>
                <h1 style="color: #f56c6c; font-size: 2rem; margin-bottom: 12px; text-align:center;">Yêu cầu đổi mật khẩu</h1>
                <p style="color: #222; font-size: 1.1rem; margin-bottom: 8px; text-align:center;">
                    <b>Bạn vừa yêu cầu đổi mật khẩu cho tài khoản Nutri4Life.</b>
                </p>
                <p style="font-size: 1.1rem; color: #222; margin-bottom: 8px; text-align:center;">
                    <b>Mã xác thực đổi mật khẩu của bạn là:</b>
                </p>
                <div style="text-align:center;">
                    <div style="background: #f5f5f5; font-size: 2.2rem; font-weight: bold; color: #f56c6c; letter-spacing: 6px; margin: 18px 0; padding: 16px 36px; border-radius: 10px; border: 3px solid #888; display: inline-block; min-width: 180px; text-align: center;">
                        ${forgotPasswordCode}
                    </div>
                </div>
                <p style="color: #222; font-size: 1.05rem; margin-top: 18px; text-align:center;">
                    Vui lòng nhập mã này để tiếp tục quá trình đổi mật khẩu.
                </p>
                <hr style="margin: 28px 0 14px 0; border: none; border-top: 2px solid #eee;">
                <p style="font-size: 0.95rem; color: #888; text-align:center;">
                    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Gửi mã xác thực yêu cầu đổi mật khẩu thành công!');
    } catch (error) {
        console.error('Lỗi khi gửi mã xác thực:', error);
    }
}

const signup = async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được đăng ký, vui lòng chọn Email khác!' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu không khớp!',
            });
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
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
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
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
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
            isFirstLogin: user.isFirstLogin,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
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
        const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();

        existingUser.forgotPasswordCode = forgotPasswordCode;
        await existingUser.save();

        // Send the verification code to the user's email
        await sendForgotPasswordCode(email, forgotPasswordCode);

        return res.status(200).json({
            success: true,
            message: 'Mã xác thực đổi mật khẩu đã được gửi đến email của bạn!',
        });
    } catch (error) {
        console.error('Lỗi khi gửi mã xác thực:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const resetPassword = async (req, res) => {
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
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        existingUser.verificationCode = verificationCode;
        await existingUser.save();

        await sendVerificationCode(email, verificationCode);

        return res.status(200).json({
            success: true,
            message: 'Mã xác thực đã được gửi lại đến email của bạn!',
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const resendForgotPasswordCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }

        const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();

        existingUser.forgotPasswordCode = forgotPasswordCode;
        await existingUser.save();

        return res.status(200).json({
            success: true,
            message: 'Mã xác thực yêu cầu đổi mật khẩu đã được gửi lại đến email của bạn!',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const googleCallback = async (req, res) => {
    const token = jwt.sign(
        { userId: req.user._id },
        process.env.TOKEN_KEY,
        { expiresIn: '1h' }
    );

    console.log('User:', req.user);
    console.log('Token:', token);

    if (req.user.isFirstLogin) {
        return res.redirect(`http://localhost:5500/first.html?token=${token}`);
    }
    return res.redirect(`http://localhost:5500/test.html?token=${token}`);
}

module.exports = {
    signup,
    verifyAccount,
    getForgotPasswordCode,
    resetPassword,
    login,
    resendVerificationCode,
    resendForgotPasswordCode,
    googleCallback,
};
