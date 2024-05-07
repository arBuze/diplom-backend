const { HTTP_STATUS_CREATED } = require('http2').constants;
const path = require('path');
const fs = require('fs');

const Repair = require('../models/repair');
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createApplication = (req, res, next) => {
  const {
    description,
    contact,
    /* isGuest, */
    fileNames,
  } = req.body;

  Repair.create({
    description,
    contact,
    owner: req.user_id,
    /* isGuest, */
    files: fileNames || [],
  })
    .then((app) => res.status(HTTP_STATUS_CREATED).send({ application: app }))
    .catch(() => next(new ServerError(errorMessages.serverErr)));
};

module.exports.getAllApplications = (req, res, next) => {
  Repair.find({})
    .then((apps) => res.send(apps))
    .catch(() => next(new ServerError(errorMessages.serverErr)));
};

module.exports.getUserApplications = (req, res, next) => {
  Repair.find({ owner: req.user._id })
    .then((apps) => res.send(apps))
    .catch(() => next(new ServerError(errorMessages.serverErr)));
};

module.exports.fileTake = (req, res) => {
  const { maxFiles } = req.body;
  const arr = [];
  for (let i = 0; i < req.files.length; i += 1) {
    if (i < maxFiles) {
      const name = req.files[i].filename + path.extname(req.files[i].originalname);
      const newName = req.files[i].path + path.extname(req.files[i].originalname);
      fs.rename(req.files[i].path, newName, (err) => {
        if (err) console.log(err);
      });
      arr.push(name);
    } else {
      try {
        if (fs.existsSync(req.files[i].path)) {
          fs.unlink(req.files[i].path, (err) => {
            if (err) console.log(err);
            console.log({ message: 'File has been deleted' });
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return res.status(201).send({ imageNames: arr });
};

module.exports.deleteImages = (req, res, next) => {
  const { fileName } = req.body;
  const dir = path.join(__dirname, '../uploads/temp', fileName);

  try {
    if (fs.existsSync(dir)) {
      fs.unlink(dir, (err) => {
        if (err) return next(new NotFoundError('dqawdaa'));
        return res.status(200).send({ message: 'File has been deleted' });
      });
    }
    return 0;
  } catch (err) {
    return next(new NotFoundError('asdas'));
  }
};
