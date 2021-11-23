const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { createUser, usersLogin, } = require('../controllers/users');

const errorMessages = require('../errors/errorMessages');

router.post('/signin', celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().custom((value) => {
            if (validator.isEmail(value)) return value;
            throw new Error();
        }).messages(errorMessages.email),
        password: Joi.string().required().min(6).messages(errorMessages.password),
    }),
}), usersLogin);

router.post('/signup', celebrate({
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

module.exports = router;