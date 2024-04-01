require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/constants');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/sitedb' } = process.env;
const app = express();

app.use(cors({ origin: ['http://localhost:3001'] }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

mongoose.connect(`${MONGO_URL}`, {
  useNewUrlParser: true,
});

app.use(errors());

app.listen(PORT);
