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

const calculateTotalCalories = async (foodsInMeal) => {
    let totalCalories = 0;
    for (const foodItem of foodsInMeal) {
        const food = await Food.findById(foodItem.food);
        if (!food) {
            throw new Error(`Food with ID ${foodItem.food} not found`);
        }
        totalCalories += food.calories * (foodItem.quantity / food.unit);
    }
    return totalCalories;
}

const createMeal = async (req, res) => {
    const { session, foodsInMeal } = req.body;
    try {
        const user = req.user._id;
        const meal = new Meal({ user, session, foodsInMeal });

        meal.totalCalories = await calculateTotalCalories(foodsInMeal);

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
            message: 'Lỗi khi tạo bữa ăn',
            error: error.message,
        });
    }
}

const getMealById = async (req, res) => {
    const { id } = req.params;

    try {
        const meal = await Meal.findById(id).populate('foodsInMeal.food');

        if (!meal) {
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

const getMealsByUserToday = async (req, res) => {
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

const getMealsByDay = async (req, res) => {
    const { day } = req.params;
    // console.log('Date:', day);
    const selectedDate = new Date(day);
    selectedDate.setHours(0, 0, 0, 0);

    try {
        const meals = await Meal.find({
            user: req.user._id,
            createdAt: {
                $gte: selectedDate,
                $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
            },
        }).populate('foodsInMeal.food');

        return res.status(200).json({
            totalMeals: meals.length,
            success: true,
            message: 'Meals of selected date retrieved successfully',
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

const getCaloriesPerDayInWeekFromMonday = async (req, res) => {
    const mondayOfWeek = getMondayOfWeek(new Date());
    const today = new Date()
    today.setHours(23, 59, 59, 999);

    try {
        const meals = await Meal.find({
            user: req.user._id,
            createdAt: {
                $gte: mondayOfWeek,
                $lte: today,
            },
        });

        const caloriesPerDay = Array(7).fill(0);

        meals.forEach(meal => {
            const createdDate = new Date(meal.createdAt);
            const dayOffset = Math.floor((createdDate - mondayOfWeek) / (1000 * 60 * 60 * 24));
            if (dayOffset >= 0 && dayOffset <= 6) {
                caloriesPerDay[dayOffset] += meal.totalCalories;
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Calories per day in week retrieved successfully',
            data: caloriesPerDay,
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

const addFoodToMeal = async (req, res) => {
    const { id } = req.params;
    const { foodsInMeal } = req.body;

    try {
        const meal = await Meal.findById(id);
        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found',
            });
        }

        for (const item of foodsInMeal) {
            const { food: foodId, quantity } = item;

            const food = await Food.findById(foodId);
            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: `Food with ID ${foodId} not found`,
                });
            }

            const foodInMeal = meal.foodsInMeal.find(
                f => f.food.toString() === foodId
            );

            if (foodInMeal) {
                return res.status(400).json({
                    success: false,
                    message: `Food already exists in meal`,
                });
            }


            meal.foodsInMeal.push({ food: foodId, quantity });
        }

        meal.totalCalories = await calculateTotalCalories(meal.foodsInMeal);

        await meal.save();

        return res.status(200).json({
            success: true,
            message: 'Foods added to meal successfully',
            data: meal,
        });
    } catch (error) {
        console.error('Error adding foods to meal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const updateFoodInMeal = async (req, res) => {
    const { id } = req.params;
    const { foodId, quantity } = req.body;

    try {
        const meal = await Meal.findById(id);
        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found',
            });
        }

        const foodInMeal = meal.foodsInMeal.find(food => food.food.toString() === foodId);
        if (!foodInMeal) {
            return res.status(404).json({
                success: false,
                message: 'Food not found in meal',
            });
        }

        foodInMeal.quantity = quantity;

        meal.totalCalories = await calculateTotalCalories(meal.foodsInMeal);

        await meal.save();

        return res.status(200).json({
            success: true,
            message: 'Food updated in meal successfully',
            data: meal,
        });
    } catch (error) {
        console.error('Error updating meal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

const deleteFoodInMeal = async (req, res) => {
    const { id } = req.params;
    const { foodId } = req.body;

    try {
        const meal = await Meal.findById(id);
        if (!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found',
            });
        }

        meal.foodsInMeal = meal.foodsInMeal.filter(food => food.food.toString() !== foodId);

        meal.totalCalories = await calculateTotalCalories(meal.foodsInMeal);

        await meal.save();

        return res.status(200).json({
            success: true,
            message: 'Food deleted from meal successfully',
            data: meal,
        });
    } catch (error) {
        console.error('Error deleting food in meal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}


module.exports = {
    createMeal,
    getMealById,
    getMealsByUserToday,
    getMealsByDay,
    getMealsInWeekFromMonday,
    getCaloriesPerDayInWeekFromMonday,
    addFoodToMeal,
    updateFoodInMeal,
    deleteFoodInMeal,
}