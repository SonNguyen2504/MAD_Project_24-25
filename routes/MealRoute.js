const express = require('express');
const router = express.Router();

const {
    createMeal,
    getMealById,
    getMealsByUserToday,
    getMealsInWeekFromMonday,
    addFoodToMeal,
    updateFoodInMeal,
    deleteFoodInMeal,
} = require('../controllers/MealController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Meal
 *   description: API theo dõi bữa ăn
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodInMeal:
 *       type: object
 *       properties:
 *         food:
 *           type: string
 *           description: ID của món ăn
 *           example: "661a126e7e5b3bdf2c37a251"
 *         quantity:
 *           type: number
 *           description: Khối lượng món ăn (gram)
 *           example: 150
 * 
 *     MealRequest:
 *       type: object
 *       properties:
 *         session:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snacks]
 *           example: lunch
 *         foodsInMeal:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodInMeal'
 * 
 *     MealResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         session:
 *           type: string
 *         totalCalories:
 *           type: number
 *         foodsInMeal:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodInMeal'
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * /api/meal:
 *   post:
 *     summary: Tạo một bữa ăn mới
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealRequest'
 *     responses:
 *       201:
 *         description: Tạo bữa ăn thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MealResponse'
 */
router.post('/', verifyToken, createMeal);

/**
 * @swagger
 * /api/meal/today:
 *   get:
 *     summary: Lấy danh sách các bữa ăn trong ngày hôm nay
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bữa ăn hôm nay
 */
router.get('/today', verifyToken, getMealsByUserToday);

/**
 * @swagger
 * /api/meal/week:
 *   get:
 *     summary: Lấy danh sách bữa ăn từ thứ 2 đến hôm nay trong tuần
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bữa ăn trong tuần
 */
router.get('/week', verifyToken, getMealsInWeekFromMonday);

/**
 * @swagger
 * /api/meal/{id}:
 *   get:
 *     summary: Lấy chi tiết một bữa ăn theo ID
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bữa ăn
 *     responses:
 *       200:
 *         description: Chi tiết bữa ăn
 */
router.get('/:id', verifyToken, getMealById);

/**
 * @swagger
 * /api/meal/add-food/{id}:
 *   post:
 *     summary: Thêm nhiều món ăn vào bữa ăn theo ID
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bữa ăn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodsInMeal
 *             properties:
 *               foodsInMeal:
 *                 type: array
 *                 description: Danh sách món ăn và số lượng cần thêm
 *                 items:
 *                   type: object
 *                   required:
 *                     - food
 *                     - quantity
 *                   properties:
 *                     food:
 *                       type: string
 *                       description: ID món ăn
 *                     quantity:
 *                       type: number
 *                       description: Số lượng món ăn
 *     responses:
 *       200:
 *         description: Chi tiết bữa ăn sau khi thêm món
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Món ăn đã tồn tại trong bữa ăn
 *       404:
 *         description: Không tìm thấy bữa ăn hoặc món ăn
 *       500:
 *         description: Lỗi máy chủ
 */

router.post('/add-food/:id', verifyToken, addFoodToMeal);

/**
 * @swagger
 * /api/meal/update-food/{id}:
 *   put:
 *     summary: Chỉnh sửa món ăn trong bữa ăn theo ID
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bữa ăn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *               - quantity
 *             properties:
 *               foodId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Chi tiết bữa ăn
 */
router.put('/update-food/:id', verifyToken, updateFoodInMeal);

/**
 * @swagger
 * /api/meal/delete-food/{id}:
 *   delete:
 *     summary: Xóa món ăn khỏi bữa ăn theo ID
 *     tags: [Meal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bữa ăn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *             properties:
 *               foodId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chi tiết bữa ăn
 */
router.delete('/delete-food/:id', verifyToken, deleteFoodInMeal);

module.exports = router;
