const mongoose = require("mongoose");

const replySchema = mongoose.Schema({
    respondingToReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    content: String, 
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply; 