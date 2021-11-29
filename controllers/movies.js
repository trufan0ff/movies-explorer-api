const Movie = require('../models/movie');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden');

const { addOwnerToMovie } = require('../utils/index');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user }).orFail(new NotFoundError('Сохраненных фильмов нет'))
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => User.findByIdAndUpdate(
  req.user,
  { $addToSet: { movies: req.body.movieId } },
)
  .orFail(new NotFoundError('Ошибка! Пользователь не найден'))
  .then(Movie.create(addOwnerToMovie(req.body, req.user)))
  .then(res.send({ message: `Фильм ${req.body.nameRU} добавлен в избранное` }))
  .catch((err) => next(err));

module.exports.deleteMovie = (req, res, next) => User.findById(req.params.id)

  .orFail(new NotFoundError('Ошибка удаления из избранного. Пользователь не найден'))
  .then(Movie.deleteMany({ _id: req.params.id, owner: req.user })
    .then((result) => {
      if (result.owner !== req.user) {
        return next(new Forbidden('Ошибка удаления из избранного. Нельзя удалять чужой фильм'));
      }
      if (result.deletedCount === 0) {
        return next(new NotFoundError('Ошибка удаления из избранного. Фильм не найден'));
      }
      return res.send({ message: 'Фильм удалён из избранного' });
    }).catch((err) => next(err)));
