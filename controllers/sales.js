const { HTTP_STATUS_CREATED } = require('http2').constants;
const path = require('path');
const fs = require('fs');

const Sale = require('../models/sale');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');

module.exports.getAllSales = (req, res, next) => {
  Sale.find({})
    .then((sales) => res.send(sales))
    .catch(() => next(new ServerError(errorMessages.serverErr)));
};

module.exports.createSale = (req, res, next) => {
  const {
    name,
    startsAt,
    endsAt,
    image,
    products,
  } = req.body;

  Sale.create({
    name,
    startsAt,
    endsAt,
    image,
    products,
  })
    .then((sale) => res.status(HTTP_STATUS_CREATED).send(sale))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(errorMessages.badRequestCreateProduct));
      }
      return next(new ServerError(errorMessages.serverErr));
    });
};

module.exports.updateSale = (req, res, next) => {
  const {
    name,
    startsAt,
    endsAt,
    image,
    products,
  } = req.body;

  Sale.findByIdAndUpdate(
    req.params.saleId,
    {
      $set: {
        name,
        startsAt,
        endsAt,
        image,
        products,
      },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )
    .then((sale) => {
      if (!sale) {
        return next(new NotFoundError(errorMessages.productNotFound));
      }
      return res.send(sale);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(errorMessages.badRequestUpdateProduct));
      }
      return next(new ServerError(errorMessages.serverErr));
    });
};

module.exports.deleteSale = (req, res, next) => {
  Sale.deleteOne(req.params.saleId)
    .then(() => res.send('deleted'))
    .catch(() => next(new ServerError(errorMessages.serverErr)));
};

module.exports.fileTake = (req, res) => {
  const name = req.files[0].fileName + path.extname(req.files[0].originalname);
  const newName = req.files[0].path + path.extname(req.files[0].originalname);
  fs.rename(req.files[0].path, newName, (err) => {
    if (err) console.log(err);
  });

  return res.status(201).send({ imageNames: name });
}
