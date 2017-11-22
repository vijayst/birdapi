const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema({
    name: String
});

const BirdSchema = new Schema({
    name: String,
    family: FamilySchema,
    appearance: String,
    distribution: String,
    photoUrl: String,
    related: [{
        type: Schema.Types.ObjectId,
        ref: 'bird'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }]
});

const Bird = mongoose.model('bird', BirdSchema);
module.exports = Bird;