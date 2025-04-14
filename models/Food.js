const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    foodName: {
        type: String,
        required: true,
    },
    unit: {
        type: Number,
        required: true,
    }, 
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    fats: {
        type: Number,
        required: true,
    },
    foodType: {
        type: String,
        enum: ['system', 'user'],
        default: 'system',
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);