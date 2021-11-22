const routes = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

routes.use('/users', require('./users'));
routes.use('/movies', require('./movies'));

routes.use('/', (req, res, next) => next(new NotFoundError('Страница отсутствует')));

module.exports = routes;