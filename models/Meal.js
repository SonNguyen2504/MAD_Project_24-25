const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    breakfast: [
        {
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
    lunch: [
        {
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
    dinner: [
        {
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
    snacks: [
        {
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
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;