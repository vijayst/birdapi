const assert = require('assert');
const Comment = require('../models/comment');

class CommentController {
    static create(req, res) {
        const commentJson = req.body;
        assert.ok(commentJson.bird, 'Bird is required');
        commentJson.datePosted = new Date();
        commentJson.user = req.user;
        const comment = new Comment(commentJson);
        comment.save()
        .then(() => {
            return Comment.findById(comment.id)
            .populate('user', 'name email')
            .populate('bird', 'name')
        })
        .then(c => res.send(c));
    }
}

module.exports = CommentController;