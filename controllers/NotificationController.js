const User = require('../models/User');
const Notification = require('../models/Notification');
const Token = require('../models/Token');
const moment = require('moment-timezone');
const axios = require('axios');
const cron = require('node-cron');

// Endpoint của Expo Push Notification
const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

const dailyNotifications = [
    { hour: 7, minute: 30, title: "Nhắc nhở bữa sáng", message: 'Chào buổi sáng! Hãy ghi nhật ký bữa sáng của bạn nào!' },
    { hour: 0, minute: 49, title: "Nhắc nhở bữa trưa", message: 'Buổi trưa vui vẻ! Đừng quên ghi nhật ký bữa ăn của bạn nhé!' },
    { hour: 17, minute: 8, title: "Nhắc nhở bữa tối", message: 'Buổi tối thư giãn chứ? Hãy chia sẻ bữa tối của bạn vào nhật ký nào!' },
];

const getDateRange = (range) => {
    const now = moment().tz('Asia/Ho_Chi_Minh');
    let start, end;

    switch (range) {
        case 'today':
            start = now.clone().startOf('day').format('YYYY-MM-DD HH:mm:ss');
            end = now.clone().endOf('day').format('YYYY-MM-DD HH:mm:ss');
            break;

        case 'week':
            start = now.clone().startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
            end = now.clone().endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
            break;

        case 'month':
            start = now.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            end = now.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss');
            break;

        default:
            start = '0000-01-01 00:00:00';
            end = now.clone().format('YYYY-MM-DD HH:mm:ss');
            break;
    }

    return { start, end };
};

// Hàm gửi push notification qua API của Expo
const sendPushNotification = async (token, title, message, notificationId, datetime) => {
    const body = {
        to: token,
        sound: 'default',
        title: title,
        body: message,
        data: {
            notificationId,
            datetime
        },
    };

    try {
        // console.log('notificationId: ' + notificationId);
        const response = await axios.post(EXPO_PUSH_ENDPOINT, body, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        console.log('Push sent:', response.data);
    } catch (error) {
        console.error('Error sending push:', error.response?.data || error.message);
    }
}

// Cron job chạy mỗi phút để check và gửi notification
cron.schedule('* * * * *', async () => {
    try {
        const now = moment().tz('Asia/Ho_Chi_Minh');

        for (const item of dailyNotifications) {
            // Tạo thời điểm scheduledDate theo giờ Asia/Ho_Chi_Minh, dạng string
            const scheduledDate = moment()
                .tz('Asia/Ho_Chi_Minh')
                .set({ hour: item.hour, minute: item.minute, second: 0, millisecond: 0 })
                .format('YYYY-MM-DD HH:mm:ss');

            const scheduledMoment = moment.tz(scheduledDate, 'YYYY-MM-DD HH:mm:ss', 'Asia/Ho_Chi_Minh');

            // Nếu chưa tới giờ thì bỏ qua
            if (now.isBefore(scheduledMoment)) continue;

            // Nếu quá giờ hơn 1 phút thì bỏ qua
            if (now.diff(scheduledMoment, 'seconds') > 60) continue;

            const tokenNotifications = await Token.find({}).populate('user');

            for (const t of tokenNotifications) {
                if (!t.user) {
                    console.log(`Token không có user hợp lệ, bỏ qua: ${t.tokenNotification}`);
                    continue;
                }

                const existing = await Notification.findOne({
                    user: t.user._id,
                    title: item.title,
                    datetime: scheduledDate,
                });

                if (existing) {
                    console.log(`Thông báo "${item.title}" đã gửi cho user ${t.user._id} hôm nay, bỏ qua.`);
                    continue;
                }

                const notification = new Notification({
                    user: t.user._id,
                    title: item.title,
                    message: item.message,
                    datetime: scheduledDate,
                });
                await notification.save();

                await sendPushNotification(t.tokenNotification, item.title, item.message, notification._id, scheduledDate);

                console.log(`Đã gửi thông báo: ${item.title} cho user ${t.user._id} lúc ${scheduledDate}`);
            }
        }
    } catch (error) {
        console.error('Lỗi cron job gửi thông báo:', error);
    }
});

const getFilteredNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const range = req.query.range || 'all';
        let query = {
            user: req.user._id
        };

        if (range !== 'all') {
            const { start, end } = getDateRange(range);
            // console.log('Date range:', start, 'to', end);
            query.datetime = { $gte: start, $lte: end }; // So sánh chuỗi
        }

        const notifications = await Notification.find(query).sort({ datetime: -1 });

        return res.status(200).json({
            success: true,
            message: 'Danh sách thông báo',
            notifications: notifications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
};

const getNotificationById = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: `Thông báo với id: ${id} không tồn tại`,
            });
        }

        // Đánh dấu là đã đọc
        if (!notification.isRead) {
            notification.isRead = true;
            await notification.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Thông báo đã được đánh dấu là đã đọc',
            notification: notification,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const getFilteredNotificationsAsMark = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const range = req.query.range || 'all';
        let query = {
            user: req.user._id
        };

        if (range !== 'all') {
            const { start, end } = getDateRange(range);
            // console.log('Date range:', start, 'to', end);
            query.datetime = { $gte: start, $lte: end }; // So sánh chuỗi
        }

        const notifications = await Notification.find(query).sort({ datetime: -1 });

        for (const notification of notifications) {
            if (!notification.isRead) {
                notification.isRead = true;
                await notification.save(); // Cập nhật vào DB
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Danh sách thông báo',
            notifications: notifications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
};

const createNotification = async (req, res) => {
    const { title, message, datetime } = req.body;

    try {
        const user = await User.findById(req.user._id);
        console.log('user: ' + user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const notification = new Notification({
            user: user._id,
            title,
            message,
            datetime
        });

        await notification.save();

        return res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            notification: notification
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

module.exports = {
    createNotification,
    getFilteredNotifications,
    getNotificationById,
    getFilteredNotificationsAsMark
}


