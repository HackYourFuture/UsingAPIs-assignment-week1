// Instructions: hhttps://github.com/HackYourFuture/UsingAPIs-assignment-week1#exercise-5-throw-dice-sequentially

// The line below makes the rollDie() function available to this file.
// Do not change or remove it.
import { rollDie } from '../helpers/pokerDiceRoller.js';

export function rollDice() {
  const results = [];

  // TODO#1
  return rollDie(1)
    .then((value) => {
      results.push(value);
      return rollDie(2);
    })
    .then((value) => {
      results.push(value);
      return results;
    });
}

function main() {
  rollDice()
    .then((results) => console.log('Resolved!', results))
    .catch((error) => console.log('Rejected!', error.message));
}

// ! Do not change or remove the code below
if (process.env.NODE_ENV !== 'test') {
  main();
}
