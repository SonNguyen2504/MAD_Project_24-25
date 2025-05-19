const RecommendMeal = require('../models/RecommendMeal');
const User = require('../models/User');

const createRecommendMeal = async (req, res) => {
    const { mealTarget, weekMeals } = req.body;

    try {
        const newRecommendMeal = new RecommendMeal({
            mealTarget,
            weekMeals,
        });

        await newRecommendMeal.save();

        return res.status(200).json({
            success: true,
            message: 'Thêm thực đơn thành công',
            recommendMeal: newRecommendMeal,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const getAllRecommendMeals = async (req, res) => {
    try {
        const recommendMeals = await RecommendMeal.find()
            .populate('weekMeals.monday.meal')
            .populate('weekMeals.tuesday.meal')
            .populate('weekMeals.wednesday.meal')
            .populate('weekMeals.thursday.meal')
            .populate('weekMeals.friday.meal')
            .populate('weekMeals.saturday.meal')
            .populate('weekMeals.sunday.meal');

        return res.status(200).json({
            success: true,
            recommendMeals,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách thực đơn gợi ý',
            error: error.message,
        });
    }
}

const getRecommendMealForUserToday = async (req, res) => {
    const userId = req.user._id;

    const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = daysMap[new Date().getDay()];

    try {
        const user = await User.findById(userId).populate('recommendMeals');

        if (!user || !user.recommendMeals) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thực đơn gợi ý' });
        }

        const recommendMeal = await RecommendMeal.findById(user.recommendMeals)
            .populate({
                path: `weekMeals.${todayKey}.meal`,
                populate: {
                    path: 'foodsInMeal.food',
                    model: 'Food'
                }
            });

        const todayMeals = recommendMeal.weekMeals[todayKey];

        return res.status(200).json({
            success: true,
            today: todayKey,
            meals: todayMeals,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Lỗi khi lấy thực đơn gợi ý hôm nay`,
            error: error.message,
        });
    }
};

const getCaloriesPerDayInWeek = async (req, res) => {
    const userId = req.user._id;

    const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    try {
        const user = await User.findById(userId).populate('recommendMeals');

        if (!user || !user.recommendMeals) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thực đơn gợi ý' });
        }

        const recommendMeal = await RecommendMeal.findById(user.recommendMeals._id)
            .populate({
                path: Object.values(daysMap).map(day => `weekMeals.${day}.meal`),
            });

        const caloriesPerDay = {};

        for (const day of daysMap) {
            const mealsOfDay = recommendMeal.weekMeals[day] || [];

            // mỗi phần tử trong mealsOfDay là { meal: {...} }
            let totalCalories = 0;

            for (const item of mealsOfDay) {
                if (item.meal && item.meal.totalCalories) {
                    totalCalories += item.meal.totalCalories;
                }
            }

            caloriesPerDay[day] = totalCalories;
        }

        return res.status(200).json({
            success: true,
            caloriesPerDay
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi tính tổng calo trong tuần',
            error: error.message
        });
    }
};



module.exports = {
    createRecommendMeal,
    getAllRecommendMeals,
    getRecommendMealForUserToday,
    getCaloriesPerDayInWeek,
}