const Movie = require('../models/movie');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden');
const CastError = require('../errors/cast-error');
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
  .then(Movie.createMovie(addOwnerToMovie(req.body, req.user)))
  .then(res.send({ message: `Фильм ${req.body.nameRU} добавлен в избранное` }))
  .catch((err) => next(err));

module.exports.deleteMovie = (req, res, next) => {
  if (!req.params.movieId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new CastError('Передан некорректный id фильма');
  }
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      }
      if (toString(movie.owner) === toString(req.user._id)) {
        Movie.findByIdAndRemove(movie._id)
          .then((removeMovie) => {
            if (removeMovie !== null) {
              res.send(removeMovie);
            } else {
              throw new NotFoundError('Фильм с указанным id не найден');
            }
          })
          .catch(next);
      } else {
        throw new Forbidden('Вы можете удалять только собственные фильмы');
      }
    })
    .catch(next);
};
