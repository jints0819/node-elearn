
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    approveComment: {
        type: Boolean
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('comments', CommentSchema);


