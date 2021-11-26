const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const handleError = require("./middlewares/error");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { MD, PORT } = require("./config");

const app = express();

app.use(helmet());
app.use(cors({
  credentials: true,
  origin: "https://api.best-films.nomoredomains.work",
}));

mongoose.connect(MD);

app.use(express.json());
app.use(requestLogger);
app.use(require("./utils/rateLimiter"));
app.use(require("./routes/index"));
app.use(require("./middlewares/auth"));

app.use(require("./errors/handlerError"));

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => console.log(`App listining on port: ${PORT}`));
