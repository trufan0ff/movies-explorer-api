const { isCelebrateError } = require('celebrate');
const CastError = require('./cast-error');
const ConflictError = require('./ConflictErr');

module.exports = (err, req, res, next) => {
  if (err.name === 'MongoError' && err.code === 11000) {
    return next(new ConflictError('Email уже используется'));
  }
  if (isCelebrateError(err)) {
    if (err.details.has('body')) return next(new CastError(err.details.get('body').message));
    if (err.details.has('params')) return next(new CastError(err.details.get('params').message));
  }
  return next(err);
};
