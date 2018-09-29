export default async function proceedOneRound(callback) {
  let numTicks = 30; // 30 ticks * 100 milliseconds = 3 seconds
  for (let i = 0; i < numTicks; ++i) {
    callback(await waitForValue());
  }
  return Promise.resolve();
}

function waitForValue() {
  // Random number between 1 and 3 inclusive
  const val = Math.floor(Math.random() * 3) + 1; 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(val);
    }, 100);
  });
}