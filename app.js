const fs = require("fs");
const express = require("express");
const app = express();
const https = require("https");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

// Create Game fs JSON function.

const createGame = (res, jsonObject) => {
  const parsedWords = JSON.parse(jsonObject).words;
  const wordToGuess =
    parsedWords[Math.floor(Math.random() * parsedWords.length)];

  let json = JSON.stringify({
    wordToGuess,
    lives: 10,
    guessedLetters: [],
    wordGuessed: false
  });

  fs.writeFile("data.json", json, "utf8", (err, data) => {
    if (err) {
      res.send("Sorry an error occured saving game data");
    } else {
      res.send("Game created!");
    }
  });
};

// Fetch words api call & saves to JSON function.

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
              createGame(res, json);
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

// Start Game Route.

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
      createGame(res, data);
    }
  });
});

// Guess Letter Joi Params.

const querySchema = Joi.object({
  letter: Joi.string()
    .regex(/^[a-zA-Z]/)
    .min(1)
    .max(1)
    .required()
});

// Guess Letter Route.

app.get("/guess/:letter", validator.params(querySchema), (req, res) => {
  fs.readFile("data.json", (err, data) => {
    // Check if game has been created.
    if (err) {
      if (
        err.message === "ENOENT: no such file or directory, open 'data.json'"
      ) {
        res.send("Please create a game!");
      } else {
        console.error(err);
        res.send("Sorry an error occured!");
      }
      // Guess letter.
    } else {
      let gameData = JSON.parse(data);
      let message = "";
      let lettersRemaining = 0;

      // Check game is still running.
      if (gameData.lives.length !== 0 || gameData.wordGuessed === false) {
        if (
          gameData.guessedLetters.findIndex(x => x === req.params.letter) > -1
        ) {
          message = `You have already guessed "${req.params.letter}"`;
        } else {
          let lettersToGuess = gameData.wordToGuess.split("");

          gameData.guessedLetters.map(x => {
            lettersToGuess = lettersToGuess.filter(l => l !== x);
          });

          const preLetterCount = lettersToGuess.length;
          lettersToGuess = lettersToGuess.filter(x => x !== req.params.letter);

          if (preLetterCount === lettersToGuess.length) {
            message = `Ouch you guessed "${req.params.letter}" but took 1 life`;
            gameData.lives -= 1;
          } else if (lettersToGuess.length === 0) {
            gameData.wordGuessed = true;
          } else {
            message = `You guessed correct with "${req.params.letter}"!`;
          }

          lettersRemaining = lettersToGuess.length;
          gameData.guessedLetters.push(req.params.letter);

          // Save guess.
          fs.writeFile(
            "data.json",
            JSON.stringify(gameData),
            "utf8",
            (err, data) => {
              if (err) {
                res.send("Sorry an error occured saving game data");
              }
            }
          );
        }
      }

      if (gameData.lives.length === 0) {
        message = `Unluckly you couldn't guess the word "${gameData.wordToGuess}"! Run /start to play again`;
      } else if (gameData.wordGuessed === true) {
        message = `Congrats you won with ${gameData.lives} lives left! The word you guessed was "${gameData.wordToGuess}"! Run /start to play again`;
      }

      res.send({
        message,
        result: {
          wordLength: gameData.wordToGuess.length,
          lettersRemaining,
          guessedLetters: gameData.guessedLetters,
          lives: gameData.lives
        }
      });
    }
  });
});

app.listen(3000, () => console.log(`Hangman app listening on port 3000!`));
