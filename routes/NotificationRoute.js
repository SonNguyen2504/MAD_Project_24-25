const express = require('express');
const router = express.Router();

const { createNotification,
    getFilteredNotifications,
    getNotificationById,
    getFilteredNotificationsAsMark
} = require('../controllers/NotificationController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: API liên quan đến thông báo (Notification)
 */

/**
 * @swagger
 * /api/notification:
 *   post:
 *     summary: Tạo thông báo
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - datetime
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cập nhật dữ liệu sức khỏe
 *               message:
 *                 type: string
 *                 example: Bạn đã đạt mục tiêu uống nước hôm nay!
 *               datetime:
 *                 type: string
 *                 description: Thời gian nhận thông báo (theo giờ Việt Nam, định dạng YYYY-MM-DD HH:mm:ss)
 *                 example: "2025-05-19 14:45:00"
 *     responses:
 *       201:
 *         description: Tạo thông báo thành công
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi server
 */
router.post('/', verifyToken, createNotification);

/**
 * @swagger
 * /api/notification:
 *   get:
 *     summary: Lấy danh sách thông báo theo phạm vi thời gian
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *           default: all
 *         description: Lọc thông báo theo ngày, tuần, tháng hoặc tất cả
 *     responses:
 *       200:
 *         description: Lấy danh sách thông báo thành công
 *       404:
 *         description: Không có thông báo nào
 *       500:
 *         description: Lỗi server
 */
router.get('/', verifyToken, getFilteredNotifications);


/**
 * @swagger
 * /api/notification/{id}:
 *   get:
 *     summary: Lấy thông tin thông báo theo ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID thông báo
 *     responses:
 *       200:
 *         description: Thông tin thông báo
 */
router.get('/:id', verifyToken, getNotificationById);


/**
 * @swagger
 * /api/notification/filter/mark:
 *   get:
 *     summary: Lấy danh sách thông báo theo phạm vi thời gian và đánh dấu đã đọc
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *           default: all
 *         description: Lọc thông báo theo ngày, tuần, tháng hoặc tất cả và đánh dấu đã đọc
 *     responses:
 *       200:
 *         description: Lấy danh sách thông báo thành công
 *       404:
 *         description: Không có thông báo nào
 *       500:
 *         description: Lỗi server
 */
router.get('/filter/mark', verifyToken, getFilteredNotificationsAsMark);


module.exports = router;