const express = require('express');
const router = express.Router();

const {
    createRecommendMeal,
    getAllRecommendMeals,
    getRecommendMealForUserToday,
    getCaloriesPerDayInWeek,
    getRecommendMealBaseOnUserInfo,
} = require('../controllers/RecommendMealController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: RecommendMeal
 *   description: Quản lý thực đơn gợi ý theo tuần
 */

/**
 * @swagger
 * /api/recommend-meal/:
 *   post:
 *     summary: Tạo thực đơn gợi ý theo tuần
 *     tags: [RecommendMeal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mealTarget
 *               - weekMeals
 *             properties:
 *               mealTarget:
 *                 type: string
 *                 enum: [Giảm cân, Giữ cân, Tăng cân]
 *                 description: Mục tiêu của thực đơn
 *               weekMeals:
 *                 type: object
 *                 description: Thực đơn cho từng ngày trong tuần
 *                 properties:
 *                   monday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *                   tuesday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *                   wednesday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *                   thursday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *                   friday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *                   saturday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *                   sunday:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         meal:
 *                           type: string
 *     responses:
 *       200:
 *         description: Tạo thực đơn thành công
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/recommend-meal/all:
 *   get:
 *     summary: Lấy danh sách tất cả thực đơn gợi ý
 *     tags: [RecommendMeal]
 *     responses:
 *       200:
 *         description: Trả về danh sách thực đơn
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/recommend-meal/today:
 *   get:
 *     summary: Lấy thực đơn gợi ý hôm nay của người dùng
 *     tags: [RecommendMeal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thực đơn hôm nay
 *       404:
 *         description: Không tìm thấy thực đơn
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/recommend-meal/calories:
 *   get:
 *     summary: Lấy tổng lượng calo mỗi ngày trong tuần từ thực đơn gợi ý của người dùng
 *     tags: [RecommendMeal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về tổng calo mỗi ngày
 *       404:
 *         description: Không tìm thấy thực đơn
 *       500:
 *         description: Lỗi máy chủ
 */

/**
 * @swagger
 * /api/recommend-meal/recommend:
 *   get:
 *     summary: Lấy thực đơn gợi ý dựa trên mục tiêu và lượng calo của người dùng
 *     tags: [RecommendMeal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: target
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Giảm cân, Giữ cân, Tăng cân]
 *         description: Mục tiêu ăn uống của người dùng
 *       - in: query
 *         name: dailyCalorieTarget
 *         required: true
 *         schema:
 *           type: number
 *         description: Lượng calo mục tiêu mỗi ngày của người dùng
 *     responses:
 *       200:
 *         description: Lấy thực đơn gợi ý thành công
 *       404:
 *         description: Không tìm thấy thực đơn gợi ý
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */


router.post('/', createRecommendMeal);
router.get('/all', getAllRecommendMeals);
router.get('/today', verifyToken, getRecommendMealForUserToday);
router.get('/calories', verifyToken, getCaloriesPerDayInWeek);
router.get('/recommend', verifyToken, getRecommendMealBaseOnUserInfo);

module.exports = router;