require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/constants');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, './uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '_' + Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + uniqueSuffix);
  },
});
const upload = multer({ storage });

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

const fileTake = (req, res) => {
  console.log(req.files);
  const arr = [];
  for (let i = 0; i < req.files.length; i += 1) {
    const name = req.files[i].filename + path.extname(req.files[i].originalname);
    const newName = req.files[i].path + path.extname(req.files[i].originalname);
    fs.rename(req.files[i].path, newName, (err) => {
      if (err) console.log(err);
      console.log(arr, i);
    });
    arr.push(name);
  }
  return res.status(201).send({ imageNames: arr });
};

app.use('/uploads', express.static('uploads'));

app.post('/images', upload.array('images', 10), fileTake);

app.use(errors());

app.listen(PORT);
