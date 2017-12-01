const assert = require('assert');
const mongoose = require('mongoose');
const Comment = require('../models/comment');

class CommentController {
    static create(req, res, next) {
        const commentJson = req.body;
        assert.ok(commentJson.bird, 'Bird is required');
        commentJson.datePosted = new Date();
        commentJson.user = req.user;
        const comment = new Comment(commentJson);
        comment.save()
        .then(() => {
            return Comment.findById(comment.id)
            .populate('user', 'name email')
            .populate('bird', 'name');
        })
        .then(c => res.send(c))
        .catch(next);
    }

    static update(req, res, next) {
        const { id } = req.params;
        assert.ok(mongoose.Types.ObjectId.isValid(id), 'Not a valid id.');
        const commentJson = req.body;
        Comment.findByIdAndUpdate(id, commentJson)
        .then(() => {
            return Comment.findById(id)
            .populate('user', 'name email')
            .populate('bird', 'name');
        })
        .then(c => res.send(c))
        .catch(next);
    }

    static remove(req, res, next) {
        const { id } = req.params;
        assert.ok(mongoose.Types.ObjectId.isValid(id), 'Not a valid id');
        Comment.findById(id)
        .then(comment => {
            assert.ok(comment, 'Comment is not available.');
            assert.equal(req.user.id, comment.user, 'Cannot delete comment from another user.');
            return comment.remove();
        })
        .then(() => res.send({ success: true }))
        .catch(next);
    }
}

module.exports = CommentController;