// rllerState object
let rollerState = {
  breeding: false,
  error: false,
  random: false,
};
rollerState.random = true;

// offspring object
let offspring = {
  geno: [],
  // pheno: [],
  // sex: [],
  // stats: [],
  // lineage: [],
  // fertility: [],
  // mutations: [],
  // defects: [],
  // traits: [],
}

function buttonRoll() {
  if (rollerState.breeding) {
    document.getElementById("output").innerHTML = rollBreeding();
  } else if (rollerState.error) {
    document.getElementById("output").innerHTML = rollError();
  } else if (rollerState.random) {
    document.getElementById("output").innerHTML = rollRandom();
  }
}
