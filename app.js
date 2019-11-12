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
  const wordToGuess = "aahing";
  let guessedLetters = ["a", "b"];
  let lives = 3;
  let lettersToGuess = wordToGuess.split("");

  guessedLetters.map(x => {
    lettersToGuess = lettersToGuess.filter(l => l !== x);
  });

  let message = "";
  if (guessedLetters.findIndex(x => x === req.params.letter) > -1) {
    message = `You have already guessed "${req.params.letter}"`;
  } else {
    message = `You successfully guessed "${req.params.letter}"`;
    guessedLetters.push(req.params.letter);

    const preLetterCount = lettersToGuess.length;

    lettersToGuess = lettersToGuess.filter(x => x !== req.params.letter);

    if (preLetterCount === lettersToGuess.length) {
      lives -= 1;
    }
  }

  res.send({
    message: message,
    result: {
      wordLength: wordToGuess.length,
      lettersRemaining: lettersToGuess.length,
      guessedLetters,
      lives
    }
  });
});

app.listen(port, () => console.log(`Hangman app listening on port ${port}!`));
