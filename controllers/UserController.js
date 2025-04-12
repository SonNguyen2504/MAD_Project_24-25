const User = require('../models/User');
const bcrypt = require('bcrypt');

const setInformation = async (req, res) => {
    const { height, weight, gender, age, bmi, target, bodyState, weightGoal, dailyCalorieTarget } = req.body;

    try {
        const user = await User.findById(req.user._id).select('-password -verificationCode -isVerify');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.height = height;
        user.weight = weight;
        user.gender = gender;
        user.age = age;
        user.bmi = bmi;
        user.target = target;
        user.dailyCalorieTarget = dailyCalorieTarget;
        user.bodyState = bodyState;
        user.weightGoal = weightGoal;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Khởi tạo thông tin thành công',
            data: user,
        })

    } catch (error) {
        console.error('Lỗi khởi tạo thông tin người dùng: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ cục bộ' });
    }
}

const getUserInformation = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -verificationCode -isVerify');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin người dùng thành công',
            userInfo: user,
        })
    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ cục bộ' });
    }
}

const updateUserInformation = async (req, res) => {
    const id = req.user._id;
    const { username, height, weight, gender, age, bmi, weightGoal } = req.body;

    try {
        const user = await User.findById(id).select('-password -verificationCode -isVerify');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // user.email = email;
        user.username = username;
        user.height = height;
        user.weight = weight;
        user.gender = gender;
        user.age = age;
        user.bmi = bmi;
        user.weightGoal = weightGoal;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin người dùng thành công',
            userInfo: user,
        })

    } catch (error) {
        console.error('Lỗi cập nhật thông tin người dùng: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ cục bộ' });
    }
}

const changePassword = async(req, res) => {
    const id = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Vui lòng đăng nhập!' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng, vui lòng nhập lại' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Thay đổi mật khẩu thành công',
        })
    } catch (error) {
        console.error('Lỗi thay đổi mật khẩu: ', error);
        return res.status(500).json({ message: 'Lỗi máy chủ cục bộ' });
    }

}

module.exports = {
    setInformation,
    getUserInformation,
    updateUserInformation,
    changePassword,
}