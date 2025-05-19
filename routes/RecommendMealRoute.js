const express = require('express');
const router = express.Router();

const {
    createRecommendMeal,
    getAllRecommendMeals,
    getRecommendMealForUserToday,
    getCaloriesPerDayInWeek,
} = require('../controllers/RecommendMealController');

const { verifyToken } = require('../middlewares/auth');

router.post('/', createRecommendMeal);
router.get('/all', getAllRecommendMeals);
router.get('/today', verifyToken, getRecommendMealForUserToday);
router.get('/calories', verifyToken, getCaloriesPerDayInWeek);

module.exports = router;