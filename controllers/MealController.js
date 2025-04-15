const Meal = require('../models/Meal');
const Food = require('../models/Food');

const getMondayOfWeek = (date) => {
    const day = date.getDay() || 7; // lấy ngày hiện tại, 1 - 7 (Thứ 2 - Chủ nhật)
    if (day !== 1) { // nếu không phải thứ 2
        date.setHours(-24 * (day - 1)); // lùi về thứ 2
    }
    date.setHours(0, 0, 0, 0); 
    return date;
}

const createMeal = async(req, res) => {
    const { session, foodsInMeal } = req.body;
    try {
        const user = req.user._id;
        const meal = new Meal({ user, session, foodsInMeal });
        let totalCalories = 0;

        for (const foodItem of foodsInMeal) {
            const food = await Food.findById(foodItem.food);
            if (!food) {
                return res.status(404).json({ message: 'Food not found' });
            }
            totalCalories += food.calories * (foodItem.quantity / 100);
        }

        meal.totalCalories = totalCalories;
        await meal.save();

        console.log('Meal created:', meal);

        return res.status(201).json({
            success: true,
            message: 'Meal created successfully',
            data: meal,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const getMealById = async(req, res) => {
    const { id } = req.params;

    try {
        const meal = await Meal.findById(id).populate('foodsInMeal.food');
        
        if(!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Meal retrieved successfully',
            data: meal,
        })
    } catch (error) {
        console.error('Error retrieving meal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const getMealsByUserToday = async(req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    try {
        const meals = await Meal.find({
            user: req.user._id,
            createdAt: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
        }).populate('foodsInMeal.food');
        return res.status(200).json({
            totalMeals: meals.length,
            success: true,
            message: 'Meals of today retrieved successfully',
            data: meals,
        });
    } catch (error) {  
        console.error('Error retrieving meals:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const getMealsInWeekFromMonday = async (req, res) => {
    const mondayOfWeek = getMondayOfWeek(new Date());
    const today = new Date()
    today.setHours(23, 59, 59, 999); 

    // console.log('Monday of the week:', mondayOfWeek); 
    // console.log('Today:', today); 

    try {
        const meals = await Meal.find({
            user: req.user._id,
            createdAt: {
                $gte: mondayOfWeek,
                $lte: today,
            },
        }).populate('foodsInMeal.food');

        // key 0 - 2 <=> t2 -> CN
        const groupedMeals = {
            0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
        };

        meals.forEach(meal => {
            const createdDate = new Date(meal.createdAt);
            const dayOffset = Math.floor((createdDate - mondayOfWeek) / (1000 * 60 * 60 * 24));
            // console.log('Day offset:', dayOffset); 
            
            if (dayOffset >= 0 && dayOffset <= 6) {
                groupedMeals[dayOffset].push(meal);
            }
        });

        return res.status(200).json({
            totalMeals: meals.length,
            success: true,
            message: 'Meals of this week from Monday retrieved successfully',
            data: groupedMeals,
        });
    } catch (error) {
        console.error('Error retrieving meals:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


module.exports = {
    createMeal,
    getMealById,
    getMealsByUserToday,
    getMealsInWeekFromMonday,
}