const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const { NODE_ENV } = process.env;
const NotFoundError = require('../errors/not-found-err');
const LoginPasswordError = require('../errors/login-password-error');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  if (typeof req.body === 'undefined') {
    return next(new LoginPasswordError('Указан неверный логин или пароль'));
  }
  const { name, email, password } = req.body;

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.send({
        _id: user._id,
        name,
        email,
      }))
      .catch((err) => next(err));
  });
};

module.exports.updateProfile = (req, res, next) => {
  const newData = {};
  if (req.body.name) {
    newData.name = req.body.name;
  }

  if (req.body.email) {
    newData.email = req.body.email;
  }
  User.findByIdAndUpdate(req.user, newData, { runValidators: true, new: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ name: user.name, email: user.email, movies: user.movies }))
    .catch((err) => next(err));
};

module.exports.usersLogin = (req, res, next) => {
  const { email, password } = req.body;
  let findedUser;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new LoginPasswordError('Неправильные почта или пароль');
      }
      findedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new LoginPasswordError('Неправильные почта или пароль');
      }
      // создадим токен
      const token = jwt.sign({ _id: findedUser._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET, { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(next);
};
