const { HTTP_STATUS_CREATED } = require('http2').constants;
const path = require('path');
const fs = require('fs');

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
    quantity,
    articule,
  } = req.body;

  Product.create({
    name,
    category,
    images,
    characteristics,
    price,
    description,
    articule,
    quantity,
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
    quantity,
    articule,
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
        quantity,
        articule,
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

module.exports.upgradeProductRating = (req, res, next) => {
  const { rating } = req.body;

  Product.findByIdAndUpdate(
    req.params.productId,
    {
      $set: {
        rating,
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

module.exports.fileTake = (req, res) => {
  const arr = [];

  for (let i = 0; i < req.files.length; i += 1) {
    const name = req.files[i].filename + path.extname(req.files[i].originalname);
    const newName = req.files[i].path + path.extname(req.files[i].originalname);
    fs.rename(req.files[i].path, newName, (err) => {
      if (err) console.log(err);
    });
    arr.push(name);
  }

  return res.status(201).send({ imageNames: arr });
};

module.exports.deleteImages = (req, res, next) => {
  const { fileName } = req.body;
  const dir = path.join(__dirname, '../src-images/product_images', fileName);

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
