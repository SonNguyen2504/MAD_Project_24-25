const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
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
        default: null,
    },
    age: {
        type: Number,
        default: null,
    },
    height: {
        type: Number,
        default: null,
    },
    weight: {
        type: Number,
        default: null,
    },
    bmi: {
        type: Number,
        default: null,
    },
    bodyState: {
        type: String,
        default: null,
    },
    weightGoal: {
        type: Number,
        default: null,
    },
    isFirstLogin: {
        type: Boolean,
        default: true,
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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);