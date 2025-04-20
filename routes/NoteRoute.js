const express = require('express');
const router = express.Router();

const {
    createNote,
    getNotesByUserId,
    getNoteById,
    getNotesByRating,
    updateNote,
    deleteNote,
} = require('../controllers/NoteController');

const { verifyToken } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Note
 *   description: API liên quan đến đánh giá món ăn (note)
 */

/**
 * @swagger
 * /api/note:
 *   post:
 *     summary: Tạo đánh giá cho món ăn
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodId
 *               - content
 *               - rating
 *             properties:
 *               foodId:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: string
 *                 enum: [Lành mạnh, Không lành mạnh]
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *       404:
 *         description: Không tìm thấy user hoặc food
 *       500:
 *         description: Lỗi server
 */
router.post('/', verifyToken, createNote);

/**
 * @swagger
 * /api/note:
 *   get:
 *     summary: Lấy tất cả đánh giá của người dùng
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách note thành công
 *       404:
 *         description: Không có note nào
 *       500:
 *         description: Lỗi server
 */
router.get('/', verifyToken, getNotesByUserId);

/**
 * @swagger
 * /api/note/rating:
 *   get:
 *     summary: Lọc đánh giá theo mức độ lành mạnh
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rating
 *         schema:
 *           type: string
 *           enum: [healthy, unhealthy]
 *         required: true
 *         description: Lọc theo 'healthy' hoặc 'unhealthy'
 *     responses:
 *       200:
 *         description: Lấy danh sách note theo đánh giá thành công
 *       400:
 *         description: Giá trị rating không hợp lệ
 *       404:
 *         description: Không có note nào
 *       500:
 *         description: Lỗi server
 */
router.get('/rating', verifyToken, getNotesByRating);

/**
 * @swagger
 * /api/note/{id}:
 *   get:
 *     summary: Lấy chi tiết một đánh giá
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy note thành công
 *       404:
 *         description: Không tìm thấy note
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', verifyToken, getNoteById);

/**
 * @swagger
 * /api/note/{id}:
 *   put:
 *     summary: Cập nhật một đánh giá
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: string
 *                 enum: [Lành mạnh, Không lành mạnh]
 *     responses:
 *       200:
 *         description: Cập nhật note thành công
 *       404:
 *         description: Không tìm thấy note
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', verifyToken, updateNote);

/**
 * @swagger
 * /api/note/{id}:
 *   delete:
 *     summary: Xoá một đánh giá
 *     tags: [Note]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá note thành công
 *       404:
 *         description: Không tìm thấy note
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', verifyToken, deleteNote);

module.exports = router;
