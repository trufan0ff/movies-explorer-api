const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const NotFoundError = require('../errors/not-found-err');
const auth = require('../middlewares/auth');
const { createUser, usersLogin } = require('../controllers/users');
const errorMessages = require('../errors/errorMessages');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new Error();
    }).messages(errorMessages.email),
    password: Joi.string().required().min(6).messages(errorMessages.password),
  }),
}), usersLogin);

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value) => {
      if (validator.isEmail(value)) return value;
      throw new Error();
    }).messages(errorMessages.email),
    password: Joi.string().required().min(6).messages(errorMessages.password),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': 'Не указана почта',
        'string.empty': 'Поле "имя" не содержит информацию',
        'string.min': 'Имя должно содержать не менее {#limit} символов',
        'string.max': 'Имя должно содержать не более {#limit} символов',
      }),
  }),
}), createUser);

routes.use(auth);
routes.use('/users', require('./users'));
routes.use('/movies', require('./movies'));

routes.use('/*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
module.exports = routes;
