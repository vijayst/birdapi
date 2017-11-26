const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_SECRET
};

const strategy = new Strategy(options, function(payload, done) {
    const userId = payload.sub;
    User.findById(userId)
    .then(user => {
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(strategy);
const tokenMiddleware = passport.authenticate('jwt', { session: false });
module.exports = tokenMiddleware;
