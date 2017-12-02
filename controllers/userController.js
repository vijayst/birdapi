const jwt = require('jwt-simple');
const assert = require('assert');
const mongoose = require('mongoose');
const User = require('../models/user');
const Bird = require('../models/bird');

class UserController {
    static signup(req, res, next) {
        const { email, password } = req.body;
        assert.ok(email, 'Email is required.');
        assert.ok(password, 'Password is required.');
        User.findOne({ email })
            .then(userInDb => {
                assert.ok(!userInDb, 'Email is in use');
                const user = new User({ email, password });
                return user.save();
            })
            .then((user) => {
                const token = jwt.encode({ sub: user.id }, process.env.JWT_SECRET);
                res.send({ token });
            })
            .catch(next);
    }

    static login(req, res) {
        // passport attaches the user to the request!
        const { user } = req;
        const token = jwt.encode({ sub: user.id }, process.env.JWT_SECRET);
        res.send({ token });
    }

    static index(req, res) {
        const { name, email } = req.user;
        res.send({ name, email });
    }

    static removeSelf(req, res, next) {
        const { _id, role } = req.user;
        assert.notEqual(role, 'admin', 'Cannot delete admin.');
        User.findByIdAndRemove(_id)
            .then(() => res.send({ success: true }))
            .catch(next);
    }

    static remove(req, res, next) {
        const { id } = req.params;
        const { _id } = req.user;
        assert.notEqual(id, _id, 'Cannot delete self.');
        assert.ok(mongoose.Types.ObjectId.isValid(id), 'Not a valid id');
        User.findByIdAndRemove(id)
            .then(() => res.send({ success: true }))
            .catch(next);
    }

    static toggleSeen(req, res, next) {
        const userId = req.user._id;
        const birdId = req.params.id;
        assert.ok(mongoose.Types.ObjectId.isValid(birdId), 'Invalid id');
        Bird.findById(birdId)
        .then(bird => {
            assert.ok(bird, 'Bird not found');
            return User.findById(userId)
            .populate({
              path: 'seen',
              match: { _id: birdId }  
            });
        })
        .then(user => {
            if (user.seen.length) {
                return user.update({ $pull: { seen: birdId } });
            } else {
                user.seen.push(birdId);
                return user.save();
            }
        })
        .then(() => {
            res.send({ success: true });
        })
        .catch(next);
    }
}

module.exports = UserController;