const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB = 'mongodb://localhost:27017/bestfilmsdb' } = process.env;

const app = express();

app.use(helmet());
app.use(cors({
    credentials: true,
    origin: 'https://api.best-films.nomoredomains.work',
}));

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.use(express.json());
app.use(requestLogger);
app.use(require('./utils/rateLimiter'));
app.use(require('./routes/auth'));
app.use(require('./middlewares/auth'));
app.use(require('./routes/index'));
app.use(require('./errors/handlerError'));

app.use(errorLogger);
app.use((err, req, res, next) => error(err, req, res, next));

module.exports = app;