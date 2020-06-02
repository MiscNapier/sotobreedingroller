// rollerState object
let rollerState;
function setupRollerState() {
  function parentCheck(parent) {
    if (parent.geno === false) {
      return false;
    }
    return true;
  }

  if (parentCheck(sire) && parentCheck(dam)) {
    console.log("Mode: Breeding");
    rollerState = "breeding";
  } else if (!parentCheck(sire) && !parentCheck(dam)) {
    console.log("Mode: Randomizer");
    rollerState = "randomizer";
  }
}

let item, inbred, sire, dam, fxi, ixi, offspring, error;
function setupObjects() {
  // item object
  let itemCheck = getPillSelect("itemPills");
  // console.log(itemCheck);

  item = {
    epimedium: itemCheck.indexOf("epimedium") !== -1 ? true : false,
    oddEyedToad: itemCheck.indexOf("odd-eyed toad") !== -1 ? true : false,
    gildedFeather: itemCheck.indexOf("gilded feather") !== -1 ? true : false,
    luckyButterfly: itemCheck.indexOf("lucky butterfly") !== -1 ? true : false,
  };

  if (item.epimedium) {
    item.oddEyedToad = false;
  }

  // inbred
  inbred = getCleaner("inbredCheckbox");

  // parent objects
  sire = {
    id: getCleaner("sireId"),
    geno: getCleaner("sireGeno"),
    stats:
      getCleaner("sireStats") !== false
        ? getCleaner("sireStats").replace(/\D+/g, " ").split(" ")
        : getCleaner("sireStats"),
    status: getCleaner("sireStatus"),
    lineage: getCleaner("sireLineage"),
    lineageAdditional:
      getCleaner("sireLineageAdditional") !== false
        ? getCleaner("sireLineageAdditional")
            .replace(/\s/g, "")
            .toLowerCase()
            .split(",")
        : [],
    fertility: getCleaner("sireFertility"),
    mutations: [getCleaner("sireMutations1"), getCleaner("sireMutations2")],
    traits: [
      getCleaner("sireTraits1"),
      getCleaner("sireTraits2"),
      getCleaner("sireTraits3"),
    ],
  };
  dam = {
    id: getCleaner("damId"),
    geno: getCleaner("damGeno"),
    stats:
      getCleaner("damStats") !== false
        ? getCleaner("damStats").replace(/\D+/g, " ").split(" ")
        : getCleaner("damStats"),
    status: getCleaner("damStatus"),
    lineage: getCleaner("damLineage"),
    lineageAdditional:
      getCleaner("damLineageAdditional") !== false
        ? getCleaner("damLineageAdditional")
            .replace(/\s/g, "")
            .toLowerCase()
            .split(",")
        : [],
    fertility: getCleaner("damFertility"),
    mutations: [getCleaner("damMutations1"), getCleaner("damMutations2")],
    traits: [
      getCleaner("damTraits1"),
      getCleaner("damTraits2"),
      getCleaner("damTraits3"),
    ],
  };

  // fertility checks
  fxi =
    (sire.fertility === "fertile" && dam.fertility === "infertile") ||
    (sire.fertility === "infertile" && dam.fertility === "fertile") ||
    false;
  ixi =
    (sire.fertility === "infertile" && dam.fertility === "infertile") || false;

  // offspring object
  offspring = {
    geno: [],
    pheno: [[], [], [], [], [], []],
    sex: "",
    stats: [],
    lineage: [[], []],
    fertility: "",
    mutations: [],
    defects: [],
    traits: [[], [], []],
  };

  error = [];

  // console.info(item, sire, dam, offspring);
}

function buttonRoll() {
  setupObjects();
  setupRollerState();

  if (rollerState === "breeding") {
    output(rollBreeding);
  } else if (rollerState === "randomizer") {
    output(rollRandom);
  }
}
