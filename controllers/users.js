const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require("../errors/not-found-err");
const LoginPasswordError = require("../errors/login-password-error");
const ConflictErr = require("../errors/ConflictErr");

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NotFoundError("Пользователь не найден"))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body; // получим из объекта запроса имя и описание пользователя
  User.findOne({ email: req.body.email })
    .then((registeredUser) => {
      if (registeredUser) {
        throw new ConflictErr("Пользователь с таким email уже существует");
      }

      return bcrypt.hash(password.toString(), 10);
    })
    .then((hash) => User.create({

      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch(next);
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
    .orFail(new NotFoundError("Пользователь не найден"))
    .then((user) => res.send({ name: user.name, email: user.email, movies: user.movies }))
    .catch((err) => next(err));
};

module.exports.usersLogin = (req, res, next) => {
  const { email, password } = req.body;
  let findedUser;
  User.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        throw new LoginPasswordError("Неправильные почта или пароль");
      }
      findedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new LoginPasswordError("Неправильные почта или пароль");
      }
      // создадим токен
      const token = jwt.sign({ _id: findedUser._id }, NODE_ENV === "production" ? JWT_SECRET : "secret-key", { expiresIn: "7d" });

      // вернём токен
      res.send({ token });
    })
    .catch(next);
};
