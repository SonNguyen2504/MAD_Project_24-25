const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    session: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    },
    foodsInMeal: [
        {
            _id: false,
            food: {
                type: Schema.Types.ObjectId,
                ref: 'Food',
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    totalCalories: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;