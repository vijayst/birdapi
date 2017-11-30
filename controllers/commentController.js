const Comment = require('../models/comment');

class CommentController {
    static create(req, res) {
        if (!req.body.bird) {
            res.status(422).send({ error: 'Bird is required!' });
            return;
        }
        const commentJson = req.body;
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