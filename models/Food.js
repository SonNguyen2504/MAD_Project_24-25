const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
    foodName: {
        type: String,
        required: true,
    },
    weight: {
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
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);