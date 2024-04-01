const rateLimit = require('express-rate-limit');

const urlRegex = /^https?\:\/\/[w{3}\.]?[a-zA-Z0-9\-\._~\:\\?#\[\]@!\$&'\(\)\*\+,;=]{1,}[a-zA-Z0-9\-\._~\:\/\?#\[\]@!\$&'\(\)\*\+,%;=]{1,}#?$/; // eslint-disable-line

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const errorMessages = {
  serverErr: 'Ошибка сервера',
  userNotFound: 'Пользователь по указанному _id не найден',
  badRequestId: 'Некорректный _id',
  badRequestUpdateData: 'Переданы некорректные данные при обновлении профиля',
  badRequestCreateUser: 'Переданы некорректные данные при создании пользователя',
  conflictErr: 'Пользователь с данным логином уже существует',
  badRequestCreateProduct: 'Переданы некорректные данные при создании товара',
  badRequestUpdateProduct: 'Переданы некорректные данные при обновлении товара',
  productNotFound: 'Товар с указанным _id не найден',
  badRequestCreateFeedback: 'Переданы некорректные данные при создании отзыва',
  feedbackNotFound: 'Отзыв по указанному _id не найден',
  forbiddenErr: 'Право на удаление имеет только администратор',
  createForbiddenErr: 'Право на создание имеет только администратор',
  pageNotFound: 'Страница не найдена',
};

const deleteMessage = 'Товар удален из базы данных';

module.exports = {
  urlRegex,
  limiter,
  errorMessages,
  deleteMessage,
};
