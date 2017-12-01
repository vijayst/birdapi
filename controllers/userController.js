const jwt = require('jwt-simple');
const assert = require('assert');
const User = require('../models/user');

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
        next();
    }
}

module.exports = UserController;