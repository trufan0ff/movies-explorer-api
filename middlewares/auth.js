require('dotenv').config();
const jwt = require('jsonwebtoken');
const LoginPasswordError = require('../errors/login-password-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginPasswordError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    throw new LoginPasswordError('Необходима авторизация');
  }
  req.user = payload;

  next();
};
