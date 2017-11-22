const Bird = require('../models/bird');

class BirdController {
    static create(req, res) {
        Bird.create(req.body)
            .then(bird => {
                res.send(bird);
            });
    }

    static update(req, res) {
        const { id } = req.params;
        Bird.findByIdAndUpdate(id, req.body)
            .then(() => Bird.findById(id))
            .then(bird => {
                res.send(bird);
            });
    }

    static remove(req, res) {
        const { id } = req.params;
        Bird.findByIdAndRemove(id)
            .then(() => res.send({ id }));
    }

    static index(req, res) {
        const { offset, limit } = req.query;
        Promise.all([
            Bird.find({})
                .skip(offset)
                .limit(limit),
            Bird.count()
        ]).then(([birds, count]) => {
            res.send({
                birds,
                count
            });
        });
    }
}

module.exports = BirdController;