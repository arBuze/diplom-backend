const { HTTP_STATUS_CREATED } = require('http2').constants;

const Feedback = require('../models/feedback');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');

const {
  serverErr,
  badRequestCreateFeedback,
  feedbackNotFound,
  badRequestId,
} = errorMessages;

/* получение отзывов */
module.exports.getFeedback = (req, res, next) => {
  Feedback.find({ product: req.params.productId })
    .then((feedbacks) => res.send(feedbacks))
    .catch(() => next(new ServerError(serverErr)));
};

/* создание отзыва */
module.exports.createFeedback = (req, res, next) => {
  const { rating, comment, name } = req.body;

  Feedback.create({
    owner: /* req.user._id */name,
    product: req.params.productId,
    rating,
    comment,
  })
    .then((feedback) => res.status(HTTP_STATUS_CREATED).send(feedback))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequestCreateFeedback));
      }
      return next(new ServerError(serverErr));
    });
};

module.exports.deleteFeedback = (req, res, next) => {
  Feedback.findById(req.params.feedbackId)
    .then((feedback) => {
      if (!feedback) {
        return next(new NotFoundError(feedbackNotFound));
      }
      return Feedback.deleteOne(feedback);
    })
    .then(() => res.send({ message: 'Отзыв удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* лайк отзыва */
module.exports.likeFeedback = (req, res, next) => {
  Feedback.findByIdAndUpdate(
    req.params.feedbackId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((feedback) => {
      if (!feedback) {
        return next(new NotFoundError(feedbackNotFound));
      }
      return res.send(feedback);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* дизлайк отзыва */
module.exports.dislikeFeedback = (req, res, next) => {
  Feedback.findByIdAndUpdate(
    req.params.feedbackId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((feedback) => {
      if (!feedback) {
        return next(new NotFoundError(feedbackNotFound));
      }
      return res.send(feedback);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};
