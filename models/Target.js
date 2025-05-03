const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const targetSchema = new Schema({
    targetName: { // chốt có làm enum hay không
        type: String,
        enum: ['Cân nặng', 'Bước chân'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Target', targetSchema);