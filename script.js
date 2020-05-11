let rollerState = {
  breeding: false,
  error: false,
  random: false,
};
rollerState.breeding = true;

function rollBreeding() {
  document.getElementById("output").innerHTML = randomizer(["Testing!","Test...","Boop! :D"]);
}

function rollError() {

}

function rollRandom() {

}

function buttonRoll() {
  if (rollerState.breeding) {
    rollBreeding();
  } else if (rollerState.error) {
    rollError();
  } else if (rollerState.random) {
    rollBreeding();
  }
}
