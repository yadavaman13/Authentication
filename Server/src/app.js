const express = require("express");
const app = express();
const authRoute = require('./routes/auth.routes');
const createPost = require('./routes/post.routes')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoute);
app.use('/api/auth', createPost);

module.exports = app;