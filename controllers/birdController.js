const mongoose = require('mongoose');
const assert = require('assert');
const Bird = require('../models/bird');

class BirdController {
    static create(req, res, next) {
        Bird.create(req.body)
            .then(bird => {
                res.send(bird);
            })
            .catch(next);
    }

    static update(req, res, next) {
        const { id } = req.params;
        assert.ok(mongoose.Types.ObjectId.isValid(id), 'Id is not valid!');
        Bird.findByIdAndUpdate(id, req.body)
            .then(() => Bird.findById(id))
            .then(bird => {
                res.send(bird);
            })
            .catch(next);
    }

    static remove(req, res, next) {
        const { id } = req.params;
        assert.ok(mongoose.Types.ObjectId.isValid(id), 'Id is not valid!');
        Bird.findByIdAndRemove(id)
            .then(() => res.send({ id }))
            .catch(next);
    }

    static index(req, res, next) {
        const { offset, limit } = req.query;
        Promise.all([
            Bird.find({})
                .skip(offset)
                .limit(limit),
            Bird.count()
        ])
            .then(([birds, count]) => {
                res.send({
                    birds,
                    count
                });
            })
            .catch(next);
    }
}

module.exports = BirdController;