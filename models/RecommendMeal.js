const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const recommendMealSchema = new Schema({
    target: {
        type: String,

    },
    weekMeals: {
        monday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
        tuesday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
        wednesday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
        thursday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
        friday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
        saturday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
        sunday: {
            type: Schema.Types.ObjectId,
            ref: 'Meal',
            required: true,
        },
    }
}, { timestamps: true });

module.exports = mongoose.model('RecommendMeal', recommendMealSchema); 