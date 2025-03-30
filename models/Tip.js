const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tipSchema = new Schema({
    type: {
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
}, { timestamps: true });

module.exports = mongoose.model('Tip', tipSchema);
