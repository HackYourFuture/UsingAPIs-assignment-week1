// Instructions: https://github.com/HackYourFuture/UsingAPIs-assignment-week1#instructions-ex3

// TODO#1
export function rollDie(callback) {
  // Compute a random number of rolls (3-10) that the die MUST complete
  const randomRollsToDo = Math.floor(Math.random() * 8) + 3;
  console.log(`Die scheduled for ${randomRollsToDo} rolls...`);

  const rollOnce = (roll) => {
    // Compute a random die value for the current roll
    const value = Math.floor(Math.random() * 6) + 1;
    console.log(`Die value is now: ${value}`);

    // Use callback to notify that the die rolled off the table after 6 rolls
    if (roll > 6) {
      // TODO#2
      callback(new Error('Oops... Die rolled off the table.'));
    }

    // Use callback to communicate the final die value once finished rolling
    if (roll === randomRollsToDo) {
      // TODO#3
      callback(null, value);
    }

    // Schedule the next roll todo until no more rolls to do
    if (roll < randomRollsToDo) {
      setTimeout(() => rollOnce(roll + 1), 500);
    }
  };

  // Start the initial roll
  rollOnce(1);
}

function main() {
  // TODO#4
  rollDie((error, value) => {
    if (error !== null) {
      console.log(error.message);
    } else {
      console.log(`Success! Die settled on ${value}.`);
    }
  });
}

// ! Do not change or remove the code below
if (process.env.NODE_ENV !== 'test') {
  main();
}

// TODO#5
export const explanation = `
Replace this placeholder with your explanation of why the problem described in the assignment no longer occurs after refactoring the code to use promises instead of callbacks.
`;
