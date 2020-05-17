// rollerState object
let rollerState = {
  breeding: false,
  error: false,
  random: false,
};
rollerState.random = true;

let sire, dam, offspring;
function setupObjects() {
  // parent objects
  sire = {
    id: getCleaner("sireId"),
    geno: getCleaner("sireGeno"),
    stats: getCleaner("sireStats"),
    lineage: getCleaner("sireLineage"),
    fertility: getCleaner("sireFertility"),
    mutations: getCleaner("sireMutations"),
    traits: [
      getCleaner("sireTraits1"),
      getCleaner("sireTraits2"),
      getCleaner("sireTraits3"),
    ],
  };
  dam = {
    id: getCleaner("damId"),
    geno: getCleaner("damGeno"),
    stats: getCleaner("damStats"),
    lineage: getCleaner("damLineage"),
    fertility: getCleaner("damFertility"),
    mutations: getCleaner("damMutations"),
    traits: [
      getCleaner("damTraits1"),
      getCleaner("damTraits2"),
      getCleaner("damTraits3"),
    ],
  };

  // offspring object
  offspring = {
    geno: [],
    // pheno: [],
    // sex: [],
    // stats: [],
    // lineage: [],
    // fertility: [],
    // mutations: [],
    // defects: [],
    // traits: [],
  };
}

function buttonRoll() {
  if (rollerState.breeding) {
    document.getElementById("output").innerHTML = rollBreeding();
  } else if (rollerState.error) {
    document.getElementById("output").innerHTML = rollError();
  } else if (rollerState.random) {
    output(rollRandom);
  }
}
