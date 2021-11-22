const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const router = require("express").Router();
const users = require("../controllers/users");

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error("Неправильный формат ссылки");
  }
  return value;
};

router.get("/me", users.getUserMe);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), users.updateProfile);

module.exports = router;
