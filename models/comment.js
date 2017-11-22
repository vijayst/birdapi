const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: String,
    datePosted: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    bird: {
        type: Schema.Types.ObjectId,
        ref: 'bird'
    }
});

const Comment = mongoose.model('comment', CommentSchema);
module.exports = Comment;