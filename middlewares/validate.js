const { celebrate, Joi } = require('celebrate');

const validateCreateProduct = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string().required(),
    images: Joi.array(),
    characteristics: Joi.array().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    articule: Joi.string(),
    quantity: Joi.number().required(),
  }),
});

const validateCreateApp = celebrate({
  body: Joi.object().keys({
    description: Joi.string().required(),
    contact: Joi.string().required(),
    fileNames: Joi.array(),
    status: Joi.boolean().required(),
  }),
});

module.exports = {
  validateCreateProduct,
  validateCreateApp,
};
