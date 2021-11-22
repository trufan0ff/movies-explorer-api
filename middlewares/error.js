module.exports = (error, req, res, next) => {
  if (!error.statusCode || error.statusCode === 500) {
    res.status(500).send({ message: "Ошибка сервера" });
  } else {
    res.status(error.statusCode).send({ message: error.message });
  }
  return next();
};
