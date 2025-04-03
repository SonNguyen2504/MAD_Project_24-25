const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tipSchema = new Schema({
    tipType: {
        type: String,
        enum: ['tip', 'alert'],
        required: true,
    }, 
    title: { 
        type: String,
        required: true,
    }, 
    content: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Tip', tipSchema);
