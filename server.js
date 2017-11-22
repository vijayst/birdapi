const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const BirdController = require('./controllers/birdController');
const PORT = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/birddb', { useMongoClient: true });

const app = express();
app.use(bodyParser.json());
app.post('/api/birds', BirdController.create);
app.put('/api/birds/:id', BirdController.update);
app.delete('/api/birds/:id', BirdController.remove);
app.get('/api/birds', BirdController.index);

app.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});