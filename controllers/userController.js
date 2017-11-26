const jwt = require('jwt-simple');
const User = require('../models/user');

class UserController {
    static signup(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(422).send({ error: 'Email and password is required.' });
        }
        User.findOne({ email })
        .then(user => {
            if (user) {
                return Promise.reject('Email is in use');
            } else {
                const user = new User({ email, password });
                return user.save();
            }
        })
        .then((user) => {
            const token = jwt.encode({ sub: user.id }, process.env.JWT_SECRET);
            res.send({ token });
        })
        .catch(error => {
            res.status(422).send({ error });
        });
        
    }

    static login(req, res) {

    }

    static logout(req, res) {

    }

    static index(req, res) {

    }

    static remove(req, res) {

    }
}

module.exports = UserController;