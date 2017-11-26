const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const BirdController = require('./controllers/birdController');
const UserController = require('./controllers/userController');
const loginMiddleware = require('./middleware/loginMiddleware');
const tokenMiddleware = require('./middleware/tokenMiddleware');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });

const app = express();
app.use(bodyParser.json());

app.post('/api/birds', BirdController.create);
app.put('/api/birds/:id', BirdController.update);
app.delete('/api/birds/:id', BirdController.remove);
app.get('/api/birds', BirdController.index);

app.post('/api/signup', UserController.signup);
app.post('/api/login', loginMiddleware, UserController.login);
app.get('/api/user', tokenMiddleware, UserController.index);

app.listen(process.env.PORT, () => {
    console.log(`listening at ${process.env.PORT}`);
});