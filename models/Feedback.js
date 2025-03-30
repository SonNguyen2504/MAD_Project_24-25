const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feddbackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feddbackSchema);