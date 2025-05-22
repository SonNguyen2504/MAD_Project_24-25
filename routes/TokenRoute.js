const express = require('express');
const router = express.Router();

const { registerToken } = require('../controllers/TokenController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * /api/token/register:
 *   post:
 *     summary: Đăng ký hoặc cập nhật token thông báo đẩy cho người dùng
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenNotification
 *             properties:
 *               tokenNotification:
 *                 type: string
 *                 example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
 *     responses:
 *       200:
 *         description: Token Notification đã được cập nhật hoặc đã đúng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token Notification updated successfully
 *       201:
 *         description: Token Notification mới đã được lưu thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.post('/register', verifyToken, registerToken);

module.exports = router;