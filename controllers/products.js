const { HTTP_STATUS_CREATED } = require('http2').constants;

const Product = require('../models/product');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');
const { deleteMessage } = require('../utils/constants');

const {
  serverErr,
  badRequestCreateProduct,
  productNotFound,
  badRequestId,
  badRequestUpdateProduct,
} = errorMessages;

/* получение всех товаров */
module.exports.getAllProducts = (req, res, next) => {
  Product.find({})
    .then((products) => res.send(products))
    .catch(() => next(new ServerError(serverErr)));
};

/* создание товара */
module.exports.createProduct = (req, res, next) => {
  const {
    name,
    category,
    images,
    characteristics,
    price,
    description,
  } = req.body;

  Product.create({
    name,
    category,
    images,
    characteristics,
    price,
    description,
  })
    .then((product) => res.status(HTTP_STATUS_CREATED).send(product))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequestCreateProduct));
      }
      return next(new ServerError(serverErr));
    });
};

/* обновление данных товара */
module.exports.updateProductData = (req, res, next) => {
  const {
    name,
    category,
    images,
    characteristics,
    price,
    /* sale, */
    description,
  } = req.body;

  Product.findByIdAndUpdate(
    req.params.productId,
    {
      $set: {
        name,
        category,
        images,
        characteristics,
        price,
        /* sale, */
        description,
      },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )
    .then((product) => {
      if (!product) {
        return next(new NotFoundError());
      }
      return res.send(product);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequestUpdateProduct));
      }
      return next(new ServerError(serverErr));
    });
};

/* удаление товара */
module.exports.deleteProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        return next(new NotFoundError(productNotFound));
      }
      /* сделать проверку на админа, иначе - return next(new ForbiddenError(forbiddenErr)) */
      return Product.deleteOne(product)
        .then(() => res.send({ message: deleteMessage }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};
