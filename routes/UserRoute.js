const express = require('express');
const router = express.Router();

const {
    setInformation,
    getUserInformation,
    updateUserInformation,
    changePassword,
} = require('../controllers/UserController.js');

const { verifyToken } = require('../middlewares/auth.js');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API liên quan đến người dùng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInformation:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: abc
 *         height:
 *           type: number
 *           example: 170
 *         weight:
 *           type: number
 *           example: 70
 *         gender:
 *           type: string
 *           example: male
 *         age:
 *           type: number
 *           example: 22
 *         bmi:
 *           type: number
 *           example: 25
 *         target:
 *           type: string
 *           enum: [Giảm cân, Tăng cân, Giữ cân]
 *           example: Giảm cân
 *         dailyCalorieTarget:
 *           type: number
 *           example: 1400
 *         activityLevel:
 *           type: string    
 *           enum: [Ít vận động, Vận động nhẹ, Vận động vừa, Vận động nhiều, Rất năng động]
 *           example: Vận động nhẹ 
 *         bodyState:
 *           type: string
 *           example: Thừa cân
 *         weightGoal:
 *           type: number
 *           example: 60
 *         recommedMeals:
 *           type: string
 * 
 *     ChangePassword:
 *       type: object
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: 123456
 *         newPassword:
 *           type: string
 *           example: ntsabc123
 */

/**
 * @swagger
 * /api/user/setup-information:
 *   post:
 *     summary: Khởi tạo thông tin người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInformation'
 *     responses:
 *       200:
 *         description: Thêm thông tin thành công
 */
router.post('/setup-information', verifyToken, setInformation);

/**
 * @swagger
 * /api/user/get-information:
 *   get:
 *     summary: Lấy thông tin người dùng sau khi đăng nhập
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
 */
router.get('/get-information', verifyToken, getUserInformation);

/**
 * @swagger
 * /api/user/update-information:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInformation'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/update-information', verifyToken, updateUserInformation);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Đổi mật khẩu người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
