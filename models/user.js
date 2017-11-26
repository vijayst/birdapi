const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    password: String,
    email: String,
    role: String,
    seen: [{
        type: Schema.Types.ObjectId,
        ref: 'bird'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
});

UserSchema.pre('save', function(next) {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function(password, cb) {
    const match = bcrypt.compareSync(password, this.password);
    cb(null, match);
}

const User = mongoose.model('user', UserSchema);
module.exports = User;