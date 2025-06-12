// Instructions: https://github.com/HackYourFuture/UsingAPIs-assignment-week1#instructions-ex4

// The line below makes the rollDie() function available to this file.
// Do not change or remove it.
import { rollDie } from '../helpers/pokerDiceRoller.js';

export function rollDice() {
  // TODO#1
  const dice = [1, 2, 3, 4, 5];
  return rollDie(1);
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

// TODO#2
export const explanation = `
Replace this placeholder with your explanation of why, in the case of a rejected promise, dice that have not yet finished their roll continue to do so.
`;
