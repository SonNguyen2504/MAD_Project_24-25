const express = require('express');

const router = express.Router();

const {
   testRoute,
} = require('../controllers/FoodController.js');

const { verifyToken } = require('../middlewares/auth.js');

router.get('/test', verifyToken, testRoute);

module.exports = router;