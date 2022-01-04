const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden');
const CastError = require('../errors/cast-error');
const { addOwnerToMovie } = require('../utils/index');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user }).orFail(new NotFoundError('Сохраненных фильмов нет'))
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  const owner = addOwnerToMovie(req.user._id);

  Movie.createMovie({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      if (!movie) {
        throw new CastError('Переданы некорректные данные');
      }
      const newMovie = movie.toObject();
      delete newMovie.owner;
      res.send(newMovie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new CastError('Переданы некорректные данные');
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
