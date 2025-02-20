require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { checkForAuthCookie } = require('./middlewares/auth');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');

mongoose.connect(process.env.MONGO_URL)
.then(e => console.log('MongoDb Connected'));

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie('token'));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.get('/', async(req, res) => {
    const allBlog = await Blog.find({});
    return res.render('home', {
        user: req.user,
        blog: allBlog,
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server Started at: ${PORT}`))