const fs = require("fs");
const express = require("express");
const app = express();
const https = require("https");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const port = 3000;

const createGame = res => {
  res.send("Create game here!");
};

const fetchWords = res => {
  https
    .get(
      "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt",
      response => {
        let data = "";

        response.on("data", chunk => {
          data += chunk;
        });

        response.on("end", () => {
          let words = data.split("\r\n");
          words = words.filter(word => word.length >= 3);
          let json = JSON.stringify({
            words
          });
          fs.writeFile("words.json", json, "utf8", (err, data) => {
            if (err) {
              res.send("Sorry an error occured saving words");
            } else {
              createGame(res);
            }
          });
        });
      }
    )
    .on("error", e => {
      console.error(e);
      res.send("Sorry an error occured fetching word");
    });
};

app.get("/start", (req, res) => {
  fs.readFile("words.json", (err, data) => {
    if (err) {
      // No words json object, create file.
      if (
        err.message === "ENOENT: no such file or directory, open 'words.json'"
      ) {
        fetchWords(res);
      } else {
        console.error(err);
        res.send("Sorry an error occured!");
      }
    } else {
      createGame(res);
    }
  });
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
