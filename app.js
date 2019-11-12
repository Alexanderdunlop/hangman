const express = require("express");
const app = express();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const port = 3000;

app.get("/start", (req, res) => {
  res.send("Got a get start request");
});

const querySchema = Joi.object({
  letter: Joi.string()
    .regex(/^[a-zA-Z]/)
    .min(1)
    .max(1)
    .required()
});

app.get("/guess/:letter", validator.params(querySchema), (req, res) => {
  res.send("Got a get guess request");
});

app.listen(port, () => console.log(`Hangman app listening on port ${port}!`));
