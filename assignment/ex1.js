// Instructions: https://github.com/HackYourFuture/UsingAPIs-assignment-week1#exercise-1-john-who

export const getAnonName = (firstName, callback) => {
  setTimeout(() => {
    if (!firstName) {
      callback(new Error("You didn't pass in a first name!"));
      return;
    }

    const fullName = `${firstName} Doe`;

    callback(fullName);
  }, 0);
};

function main() {
  getAnonName('John', console.log);
}

// ! Do not change or remove the code below
if (process.env.NODE_ENV !== 'test') {
  main();
}
