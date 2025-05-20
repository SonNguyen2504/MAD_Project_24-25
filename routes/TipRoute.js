const express = require('express');
const router = express.Router();

const {
    createTip,
    getTipsForUser,
    updateTipById,
    deleteTipById,
} = require('../controllers/TipController');

const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, createTip);
router.get('/', verifyToken, getTipsForUser);
router.put('/:id', verifyToken, updateTipById);
router.delete('/:id', verifyToken, deleteTipById);

/**
 * @swagger
 * tags:
 *   name: Tips
 *   description: Quản lý các tips theo mục tiêu người dùng
 */

/**
 * @swagger
 * /api/tip:
 *   post:
 *     summary: Tạo tip mới
 *     tags: [Tips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipType:
 *                 type: string
 *                 enum: [tip, alert]
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               target:
 *                 type: string
 *                 enum: [Giảm cân, Giữ cân, Tăng cân]
 *     responses:
 *       201:
 *         description: Tip created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tip:
 *   get:
 *     summary: Lấy danh sách tips theo mục tiêu của người dùng
 *     tags: [Tips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tips được trả về thành công
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tip/{id}:
 *   put:
 *     summary: Cập nhật tip theo ID
 *     tags: [Tips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipType:
 *                 type: string
 *                 enum: [tip, alert]
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               target:
 *                 type: string
 *                 enum: [Giảm cân, Giữ cân, Tăng cân]
 *     responses:
 *       200:
 *         description: Cập nhật tip thành công
 *       404:
 *         description: Không tìm thấy tip
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tip/{id}:
 *   delete:
 *     summary: Xoá tip theo ID
 *     tags: [Tips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tip
 *     responses:
 *       200:
 *         description: Xoá tip thành công
 *       404:
 *         description: Không tìm thấy tip
 *       500:
 *         description: Server error
 */


module.exports = router;
