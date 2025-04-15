const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
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
    gender: {
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
    bmi: {
        type: Number,
        required: true,
    },
    bodyState: {
        type: String,
    },
    weightGoal: {
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
    activityLevel: {
        type: String,
        enum: ['Ít vận động', 'Vận động nhẹ', 'Vận động vừa', 'Vận động nhiều', 'Rất năng động'],
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
    recommendMeals: {
        type: Schema.Types.ObjectId,
        ref: 'RecommendMeal',
    },
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);