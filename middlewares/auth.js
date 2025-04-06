const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findOne({ _id: decoded.userId });
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message,
        });
    }
}

module.exports = {
    verifyToken,
};