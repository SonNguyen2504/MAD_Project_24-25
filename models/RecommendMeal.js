const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendMealSchema = new Schema({
    mealTarget: {
        type: String,
        enum: ['Giảm cân', 'Giữ cân', 'Tăng cân'],
        required: true,
    },
    weekMeals: {
        monday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
        tuesday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
        wednesday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
        thursday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
        friday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
        saturday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
        sunday: [
            {
                _id: false,
                meal: {
                    type: Schema.Types.ObjectId,
                    ref: 'Meal',
                    required: true,
                }
            },
        ],
    }
}, { timestamps: true });

module.exports = mongoose.model('RecommendMeal', recommendMealSchema); 