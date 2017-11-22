const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BirdSchema = new Schema({
    name: String,
    family: String,
    appearance: String,
    distribution: String,
    photoUrl: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
});

const Bird = mongoose.model('bird', BirdSchema);
module.exports = Bird;