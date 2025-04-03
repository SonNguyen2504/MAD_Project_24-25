const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        // required: true,
    },
    height: {
        type: Number,
        // required: true,
    },
    weight: {
        type: Number,  
        // required: true,
    },
    weightGoal: {
        type: Number,
        // required: true,
    }, 
    steps: {
        type: Number,
    },
    target: {
        type: String,
        enum: ['Giảm cân', 'Tăng cân', 'Giữ cân'],
    },
    dailyCalorieTarget: {
        type: Number,
    },
    isVerify: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
    },
    forgotPasswordCode: {
        type: String,
    },
    meals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
        }
    ],
    recommendMeals: {
        type: Schema.Types.ObjectId,
        ref: 'RecommendMeal',
    },
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);