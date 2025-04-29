const express = require('express');
const router = express.Router();

const {
    createAchievement,
    getAchievementsByUserId,
    getAllAchievements,
} = require('../controllers/AchievementController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Achievement
 *   description: API quản lý thành tựu
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Achievement:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: Tiêu đề thành tựu
 *         content:
 *           type: string
 *           description: Nội dung thành tựu
 *         user:
 *           type: string
 *           description: ID người dùng sở hữu thành tựu
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật
 */

/**
 * @swagger
 * /api/achievement:
 *   post:
 *     summary: Tạo thành tựu mới từ một mục tiêu đã hoàn thành
 *     tags: [Achievement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetId
 *               - title
 *               - content
 *             properties:
 *               targetId:
 *                 type: string
 *                 description: ID mục tiêu cần chuyển thành thành tựu
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thành tựu được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievement'
 */
router.post('/', verifyToken, createAchievement);

/**
 * @swagger
 * /api/achievement:
 *   get:
 *     summary: Lấy danh sách thành tựu của người dùng hiện tại
 *     tags: [Achievement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thành tựu của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 achievements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Achievement'
 */
router.get('/', verifyToken, getAchievementsByUserId);

/**
 * @swagger
 * /api/achievement/all:
 *   get:
 *     summary: Lấy tất cả thành tựu của mọi người dùng
 *     tags: [Achievement]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả thành tựu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 achievements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Achievement'
 */
router.get('/all', verifyToken, getAllAchievements);



module.exports = router;