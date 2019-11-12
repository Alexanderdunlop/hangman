# hangman

#### Write the game Hangman

- This is a one player game.
- You will need to fetch a random word from this file ([https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt](https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt))
- Any word less than 3 letters should be rejected from this file
- The interface can be either a basic CLI (it does not need to be re-writing the window buffer [although that scores points]), or it could be a REST API, which the some future UI may consume.
- Regardless, the interface needs to present/report these things:
  - A section showing the number of letters in the word to guess.
  - Any correct letters should appear in that position.
  - A counter of 'lives' remaining (any incorrect guess takes a life).
  - Some form of input where the user can guess a new letter.
  - When the user wins or loses, something to announce that, and a way to 'play again'.
- Use any other libraries you think add value and accelerate this task.
- Write it in JS or TS.
- You can use a database if you wish (persisting games etc. is not a requirement), but it should be easily installable on a local machine, and install, set-up steps should be included.
- Push your attempt to a public git repo and share it with us.
- Spend no more than 3 hours on this. Do as much as you can in that time. Add as many features you think are worthwhile in that time.
- Treat this is as if you’re writing production software, we are interested to see how you work. We want to see clean consistent code which uses best practices. Details such a useful commit messages are important to us. Consider what testing strategy you might implement and write some tests if you have time.

## Dev Planning Process

- (Random word) GET https request then random math function.
- (Reject 3 less letters) Either filter out of the random words or reject and do math function again.
- (REST API) Express
- Show length of word
- Live counter (-1 for wrong guess)
- Input of new letter in body request
- Win or lose 'play again' message
- JS
- Persisting games via json file fs write to

Paths:
/start <- starts or restarts hangman game
/guess <- guess a word

Response
/start
'game created'
'game reset'
word length
lives
guessedLetters

/guess
'No game found run you must start a game first'
word length
lives
guessedLetters
'Game over, you won!'
'Game over, you lost sorry!'
'Run start to reset the game!'

## Installation

Install node modules

- [npm](www.npmjs.com) `npm install`
- [yarn](https://yarnpkg.com/) `yarn install`

## Start

Starting the express server to send requests to on `localhost:3000`

`node app.js`

## Usage

### Routes

- locahost:3000/ (GET)
  This returns Hello World!

### Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Joi](https://www.npmjs.com/package/@hapi/joi)
- [Express Joi](https://www.npmjs.com/package/express-joi-validation)
