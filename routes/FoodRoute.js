/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Quản lý thực phẩm
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Food:
 *       type: object
 *       required:
 *         - foodName
 *         - unit
 *         - calories
 *       properties:
 *         foodName:
 *           type: string
 *         unit:
 *           type: number
 *         calories:
 *           type: number
 *         protein:
 *           type: number
 *         carbs:
 *           type: number
 *         fats:
 *           type: number
 *         image:
 *           type: string
 *         foodType:
 *           type: string
 *           enum: [system, user]
 *           default: system
 */

const express = require('express');

const router = express.Router();

const {
   createFood,
   getAllFood,
   getAllFoodSystem,
   getAllFoodUser,
   getFoodById,
   updateFood,
   deleteFood,
   searchFoodByName,
} = require('../controllers/FoodController.js');
const { verifyToken } = require('../middlewares/auth.js');

/**
 * @swagger
 * /api/food:
 *   post:
 *     summary: Thêm thực phẩm mới
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Food'
 *     responses:
 *       200:
 *         description: Thêm thực phẩm thành công
 */
router.post('/', verifyToken, createFood);

/**
 * @swagger
 * /api/food:
 *   get:
 *     summary: Lấy tất cả thực phẩm
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thực phẩm
 */
router.get('/', verifyToken, getAllFood);

/**
 * @swagger
 * /api/food/search:
 *   get:
 *     summary: Tìm kiếm thực phẩm theo tên
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: foodName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên thực phẩm cần tìm
 *     responses:
 *       200:
 *         description: Danh sách thực phẩm tìm thấy
 */
router.get('/search', verifyToken, searchFoodByName);

/**
 * @swagger
 * /api/food/system:
 *   get:
 *     summary: Lấy thực phẩm hệ thống
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thực phẩm hệ thống
 */
router.get('/system', verifyToken, getAllFoodSystem);

/**
 * @swagger
 * /api/food/user:
 *   get:
 *     summary: Lấy thực phẩm của người dùng
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thực phẩm người dùng
 */
router.get('/user', verifyToken, getAllFoodUser);

/**
 * @swagger
 * /api/food/{id}:
 *   get:
 *     summary: Lấy thông tin một thực phẩm theo ID
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID thực phẩm
 *     responses:
 *       200:
 *         description: Thông tin thực phẩm
 */
router.get('/:id', verifyToken, getFoodById);

/**
 * @swagger
 * /api/food/{id}:
 *   put:
 *     summary: Cập nhật thông tin thực phẩm
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID thực phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Food'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', verifyToken, updateFood);

/**
 * @swagger
 * /api/food/{id}:
 *   delete:
 *     summary: Xóa thực phẩm
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID thực phẩm
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', verifyToken, deleteFood);

module.exports = router;
