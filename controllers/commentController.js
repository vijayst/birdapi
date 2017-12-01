const assert = require('assert');
const mongoose = require('mongoose');
const Comment = require('../models/comment');

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 20;

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

    static commentsByBird(req, res, next) {
        const { id } = req.params;
        assert.ok(mongoose.Types.ObjectId.isValid(id), 'Invalid id');
        let { offset, limit } = req.query;
        offset = offset || DEFAULT_OFFSET;
        limit = limit || DEFAULT_LIMIT;
        Promise.all([
            Comment.find({ bird: id })
                .skip(offset)
                .limit(limit),
            Comment.count({ bird: id })
        ])
            .then(([comments, count]) => {
                res.send({ comments, count });
            })
            .catch(next);
    }

    static commentsByUser(req, res, next) {
        let { offset, limit } = req.query;
        offset = offset || DEFAULT_OFFSET;
        limit = limit || DEFAULT_LIMIT;
        Promise.all([
            Comment.find({ user: req.user._id })
                .skip(offset)
                .limit(limit),
            Comment.count({ user: req.user._id })
        ])
            .then(([comments, count]) => {
                res.send({ comments, count });
            })
            .catch(next);
    }
}

module.exports = CommentController;