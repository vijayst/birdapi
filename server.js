const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const BirdController = require('./controllers/birdController');
const UserController = require('./controllers/userController');
const PORT = 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/birddb', { useMongoClient: true });

const app = express();
app.use(bodyParser.json());

app.post('/api/birds', BirdController.create);
app.put('/api/birds/:id', BirdController.update);
app.delete('/api/birds/:id', BirdController.remove);
app.get('/api/birds', BirdController.index);

app.post('/api/signup', UserController.signup);
app.post('/api/login', UserController.login);
app.post('/api/logout', UserController.logout);
app.get('/api/user', UserController.index);
app.delete('/api/user/:id', UserController.remove);

app.listen(PORT, () => {
    console.log(`listening at ${PORT}`);
});