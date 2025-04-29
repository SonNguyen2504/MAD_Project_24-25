const express = require('express');
const router = express.Router();

const {
    createTarget,
    getTargetsByUserId,
    getTargetById,
    updateTargetById,
    deleteTargetById,
} = require('../controllers/TargetController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Target
 *   description: API quản lý mục tiêu người dùng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Target:
 *       type: object
 *       required:
 *         - targetName
 *         - content
 *       properties:
 *         targetName:
 *           type: string
 *           example: Uống đủ nước
 *         content:
 *           type: string
 *           example: Uống ít nhất 2 lít nước mỗi ngày
 *         user:
 *           type: string
 *           description: ID của người dùng
 */

/**
 * @swagger
 * /api/target:
 *   post:
 *     summary: Tạo mục tiêu mới cho người dùng
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetName:
 *                 type: string
 *                 example: Uống đủ nước mỗi ngày
 *               content:
 *                 type: string
 *                 example: Uống ít nhất 8 ly nước mỗi ngày
 *     responses:
 *       201:
 *         description: Tạo mục tiêu thành công
 */
router.post('/', verifyToken, createTarget);

/**
 * @swagger
 * /api/target:
 *   get:
 *     summary: Lấy danh sách mục tiêu của người dùng
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách mục tiêu
 */
router.get('/', verifyToken, getTargetsByUserId);

/**
 * @swagger
 * /api/target/{targetId}:
 *   get:
 *     summary: Lấy thông tin một mục tiêu theo ID
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mục tiêu
 *     responses:
 *       200:
 *         description: Lấy thành công thông tin mục tiêu
 *       404:
 *         description: Không tìm thấy mục tiêu
 */
router.get('/:targetId', verifyToken, getTargetById);

/**
 * @swagger
 * /api/target/{targetId}:
 *   put:
 *     summary: Cập nhật mục tiêu theo ID
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mục tiêu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTargetName:
 *                 type: string
 *                 example: Uống đủ nước mỗi ngày
 *               newContent:
 *                 type: string
 *                 example: Uống ít nhất 8 ly nước mỗi ngày
 *     responses:
 *       200:
 *         description: Cập nhật thành công mục tiêu
 *       404:
 *         description: Không tìm thấy mục tiêu
 */
router.put('/:targetId', verifyToken, updateTargetById);

/**
 * @swagger
 * /api/target/{targetId}:
 *   delete:
 *     summary: Xóa mục tiêu theo ID
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mục tiêu cần xóa
 *     responses:
 *       200:
 *         description: Xóa mục tiêu thành công
 *       404:
 *         description: Không tìm thấy mục tiêu
 */
router.delete('/:targetId', verifyToken, deleteTargetById);


module.exports = router;
