const Food = require('../models/Food');
const removeTones = require('../middlewares/removeTones');

const createFood = async(req, res) => {
    const { foodName, unit, calories, protein, carbs, fats, foodType } = req.body;
    const fileUploaded = req.file;

    try {
        const newFood = new Food({
            foodName,
            unit,
            calories,
            protein,
            carbs,
            fats,
            image: fileUploaded.path,
            foodType: foodType || 'system',
            user: req.user._id,
        });

        await newFood.save();

        return res.status(200).json({
            success: true,
            message: 'Thêm thực phẩm thành công',
            food: newFood,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const getAllFood = async(req, res) => {
    try {
        const foods = await Food.find({});

        if(!foods) {
            return res.status(404).json({
                success: false,
                message: 'Danh sách thực phẩm trống',
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Danh sách thực phẩm',
            foods: foods,
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const getAllFoodSystem = async(req, res) => {
    try {
        const foods = await Food.find({ foodType: 'system' });

        if(!foods) {
            return res.status(404).json({
                success: false,
                message: 'Danh sách thực phẩm trống',
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Danh sách thực phẩm',
            foods: foods,
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const getAllFoodUser = async(req, res) => {
    try {
        const foods = await Food.find({
            foodType: 'user',
            user: req.user._id,
        });

        if(!foods) {
            return res.status(404).json({
                success: false,
                message: 'Danh sách thực phẩm trống',
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Danh sách thực phẩm',
            foods: foods,
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const getFoodById = async(req, res) => {
    const { id } = req.params;

    try {
        const food = await Food.findById(id);

        if(!food) {
            return res.status(404).json({
                success: false,
                message: `Thực phẩm với id: ${id} không tồn tại`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Thông tin thực phẩm có id: ${id}`,
            food: food,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const updateFood = async(req, res) => {
    const { id } = req.params;
    const { foodName, unit, calories, protein, carbs, fats } = req.body;
    const fileUploaded = req.file;

    try {
        const food = await Food.findById(id);

        food.foodName = foodName;
        food.unit = unit;
        food.calories = calories;
        food.protein = protein;
        food.carbs = carbs;
        food.fats = fats;
        food.image = fileUploaded.path;

        await food.save();

        if(!food) {
            return res.status(404).json({
                success: false,
                message: `Thực phẩm với id: ${id} không tồn tại`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật thực phẩm thành công',
            food: food,
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const deleteFood = async(req, res) => {
    const { id } = req.params;

    try {
        const food = await Food.findByIdAndDelete(id);

        if(!food) {
            return res.status(404).json({
                success: false,
                message: `Thực phẩm với id: ${id} không tồn tại`,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Xóa thực phẩm thành công',
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const searchFoodByNameUser = async (req, res) => {
    console.log('req.query : ', req.query);

    try {
        const { foodName } = req.query;

        if (!foodName) {
            return res.status(400).json({
                success: false,
                message: 'Tên thực phẩm không được để trống',
            });
        }

        // Chuẩn hóa tên thực phẩm không dấu từ input của người dùng
        const queryValue = removeTones(foodName);
        console.log('queryValue:', queryValue);

        // Tìm kiếm không dấu với Aggregation
        const foods = await Food.find({
            user: req.user._id, // tìm kiếm theo tài khoản
            foodType: 'user', // tìm kiếm thực phẩm tự người dùng thêm 
            foodNameNoAccent: { $regex: queryValue, $options: 'i' }
        })

        console.log('foods: ', foods);

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thực phẩm',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Danh sách thực phẩm tìm thấy',
            foods: foods,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

const searchFoodByNameSystem = async (req, res) => {
    console.log('req.query : ', req.query);

    try {
        const { foodName } = req.query;

        if (!foodName) {
            return res.status(400).json({
                success: false,
                message: 'Tên thực phẩm không được để trống',
            });
        }

        // Chuẩn hóa tên thực phẩm không dấu từ input của người dùng
        const queryValue = removeTones(foodName);
        console.log('queryValue:', queryValue);

        // Tìm kiếm không dấu với Aggregation
        const foods = await Food.find({
            foodType: 'system', // tìm kiếm thực phẩm hệ thống
            foodNameNoAccent: { $regex: queryValue, $options: 'i' }
        })

        console.log('foods: ', foods);

        if (!foods || foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thực phẩm',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Danh sách thực phẩm tìm thấy',
            foods: foods,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ',
            error: error.message,
        });
    }
}

module.exports = {
    createFood,
    getAllFood,
    getAllFoodSystem,
    getAllFoodUser,
    getFoodById,
    updateFood,
    deleteFood,
    searchFoodByNameUser,
    searchFoodByNameSystem,
};
