const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../models/user');

const strategy = new Strategy({
    usernameField: 'email'
}, function(email, password, done) {
    User.findOne({ email })
    .then(user => {
        if (user) {
            user.comparePassword(password, function(err, match) {
                if (match) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        } else {
            done(null, false);
        }
    });
});

passport.use(strategy);
const loginMiddleware = passport.authenticate('local', { session: false });
module.exports = loginMiddleware;
