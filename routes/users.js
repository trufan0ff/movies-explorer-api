const { celebrate, Joi } = require("celebrate");

const router = require("express").Router();
const users = require("../controllers/users");

router.get("/me", users.getUserMe);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), users.updateProfile);

module.exports = router;
