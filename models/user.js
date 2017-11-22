const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    seen: [{
        type: Schema.Types.ObjectId,
        ref: 'bird'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
});

const User = mongoose.model('user', UserSchema);
module.exports = User;