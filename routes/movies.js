const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const errorMessages = require('../errors/errorMessages');

const movieScheme = {
    string: Joi.string().required().messages(errorMessages.string),
    number: Joi.number().required().min(1).messages(errorMessages.number),
    url: Joi.string().required().custom((value) => {
        if (validator.isURL(value, { require_protocol: true })) return value;
        throw Error();
    }).messages(errorMessages.url),
};

router.get('/', getSavedMovies);

router.post('/', celebrate({
    body: Joi.object().keys({
        country: movieScheme.string,
        director: movieScheme.string,
        duration: movieScheme.number,
        year: movieScheme.string,
        description: movieScheme.string,
        image: movieScheme.url,
        trailer: movieScheme.url,
        thumbnail: movieScheme.url,
        movieId: movieScheme.number,
        nameRU: movieScheme.string,
        nameEN: movieScheme.string,
    }),
}), createMovie);

router.delete('/:id', celebrate({
    params: Joi.object({
        id: Joi.number().required().min(0).messages({
            'string.hex': 'Ошибка в полученном id',
            'string.length': 'Ошибка в полученном id',
        }),
    }),
}), deleteMovie);

module.exports = router;