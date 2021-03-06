const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

if (!process.env.HEROKU) {
    dotenv.config();
}

const BirdController = require('./controllers/birdController');
const UserController = require('./controllers/userController');
const CommentController = require('./controllers/commentController');
const loginMiddleware = require('./middleware/loginMiddleware');
const tokenMiddleware = require('./middleware/tokenMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware');
const User = require('./models/user');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });
mongoose.connection.once('open', () => {
    // seed admin user.
    User.count()
        .then(count => {
            if (count === 0) {
                const user = new User({
                    name: process.env.ADMIN_NAME,
                    email: process.env.ADMIN_EMAIL,
                    password: process.env.ADMIN_PASSWORD,
                    role: 'admin'
                });
                return user.save();
            }
        });
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/birds', tokenMiddleware, adminMiddleware, BirdController.create);
app.put('/api/birds/:id', tokenMiddleware, adminMiddleware, BirdController.update);
app.delete('/api/birds/:id', tokenMiddleware, adminMiddleware, BirdController.remove);
app.get('/api/birds', BirdController.index);
app.post('/api/birds/:id/like', tokenMiddleware, BirdController.toggleLike);

app.post('/api/signup', UserController.signup);
app.post('/api/login', loginMiddleware, UserController.login);
app.get('/api/user', tokenMiddleware, UserController.index);
app.delete('/api/user', tokenMiddleware, UserController.removeSelf);
app.delete('/api/user/:id', tokenMiddleware, adminMiddleware, UserController.remove);
app.post('/api/birds/:id/seen', tokenMiddleware, UserController.toggleSeen);

app.post('/api/comments', tokenMiddleware, CommentController.create);
app.put('/api/comments/:id', tokenMiddleware, CommentController.update);
app.delete('/api/comments/:id', tokenMiddleware, CommentController.remove);
app.get('/api/birds/:id/comments', CommentController.commentsByBird);
app.get('/api/user/comments', tokenMiddleware, CommentController.commentsByUser);

app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`listening at ${process.env.PORT}`);
});