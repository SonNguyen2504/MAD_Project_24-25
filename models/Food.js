const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const removeTones = require('../middlewares/removeTones');

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
    foodNameNoAccent: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

foodSchema.pre('save', function(next) {
    this.foodNameNoAccent = removeTones(this.foodName.toLowerCase());
    next();
});

module.exports = mongoose.model('Food', foodSchema);