require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/constants');
const router = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/sitedb' } = process.env;
const app = express();

app.use(cors({ origin: ['http://localhost:3001'], credentials: true, maxAge: 60 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

mongoose.connect(`${MONGO_URL}`, {
  useNewUrlParser: true,
});

app.use('/uploads', express.static('uploads'));
app.use('/src-images', express.static('src-images'));

app.use(router);

app.use(errors());

app.listen(PORT);
