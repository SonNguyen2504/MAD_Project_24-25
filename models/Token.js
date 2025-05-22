const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tokenNotification: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Token', TokenSchema);
