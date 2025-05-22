const Token = require('../models/Token');
const User = require('../models/User');

// Lưu TOKEN được đăng kí trên FE gửi xuống
const registerToken = async (req, res) => {
    const { tokenNotification } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Kiểm tra xem người dùng đã có token chưa
        const existingTokenNotification = await Token.findOne({ user: req.user._id });

        if (existingTokenNotification) {
            // Nếu token mới trùng với token cũ, không cần cập nhật
            if (existingTokenNotification.tokenNotification === tokenNotification) {
                return res.status(200).json({
                    success: true,
                    message: 'Token already up to date',
                });
            }

            // Cập nhật token cũ bằng token mới
            existingTokenNotification.tokenNotification = tokenNotification;

            await existingTokenNotification.save();

            return res.status(200).json({
                success: true,
                message: 'Token updated successfully',
                token: existingTokenNotification
            });
        }

        // Nếu chưa có token, tạo token mới
        const newToken = new Token({
            user: req.user._id,
            tokenNotification
        })
        await newToken.save();

        console.log('Đã lưu token mới:', tokenNotification);

        res.status(201).json({
            success: true,
            message: 'Token Notification saved successfully',
            token: newToken
        });

    } catch (error) {
        console.error('Lỗi lưu tokenNotification:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

module.exports = {
    registerToken
}