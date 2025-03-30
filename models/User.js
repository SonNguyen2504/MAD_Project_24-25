const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,  
        required: true,
    },
    target: {
        type: String,
        enum: ['Giảm cân', 'Tăng cân', 'Giữ cân'],
    },
    dailyCalorieTarget: {
        type: Number,
    },
    meals: [{
        type: Schema.Types.ObjectId,
        ref: 'Meal',
    }]
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);