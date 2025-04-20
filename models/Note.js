const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
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
        type: String,
        enum: ['Lành mạnh', 'Không lành mạnh'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);