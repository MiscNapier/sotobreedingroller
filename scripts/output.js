// roll litterSize
let litterSize = 0;
function rollLitterSize() {
  // calculate bonus
  let bonusEmptyLitter = 0;
  if (item.oddEyedToad) {
    bonusEmptyLitter += 30;
  } else if (item.epimedium) {
    bonusEmptyLitter += 20;
  }

  let bonusMaxLitter = 1;
  if (item.gildedFeather) {
    bonusMaxLitter += 2;
  }

  let bonusTwins = 1;
  if (item.luckyButterfly) {
    bonusTwins += 2;
  }

  // litter size
  let loner = sire.lineage === "loner" || dam.lineage === "loner" || false;
  let viperus =
    sire.lineage === "viperus" || dam.lineage === "viperus" || false;
  let wildcat =
    sire.lineage === "wildcat" || dam.lineage === "wildcat" || false;
  let skirit = sire.lineage === "skirit" || dam.lineage === "skirit" || false;
  let kane = sire.lineage === "kane" || dam.lineage === "kane" || false;

  if (loner || viperus) {
    litterSize = rngList(
      [
        [34 / bonusMaxLitter - bonusEmptyLitter, 0], // reduce 0 chance by bonusemptyLitter %, factor in bonusMaxLitter where applicable
        [100, rngRange(1, 2 * bonusMaxLitter)],
      ],
      100
    );
  } else if (wildcat) {
    litterSize = rngList(
      [
        [25 / bonusMaxLitter - bonusEmptyLitter, 0],
        [100, rngRange(1, 3 * bonusMaxLitter)],
      ],
      100
    );
  } else if (skirit) {
    litterSize = rngList(
      [
        [20 / bonusMaxLitter - bonusEmptyLitter, 0],
        [100, rngRange(1, 4 * bonusMaxLitter)],
      ],
      100
    );
  } else if (kane) {
    litterSize = rngList(
      [
        [17 / bonusMaxLitter - bonusEmptyLitter, 0],
        [100, rngRange(1, 6 * bonusMaxLitter)],
      ],
      100
    );
  }

  // fertility overrides
  if (fxi && rng(100) <= 95) {
    litterSize = 0;
  }
  if (ixi && rng(100) <= 99) {
    litterSize = 0;
  }

  // twins, triplets, quadruplets
  let ttqList = [
    [1, 3], // add 3 for quadruplets, etc.
    [6, 2],
    [16 * bonusTwins, 1],
    [100, 0],
  ];
  litterSize += rngList(ttqList, 100);

  console.info(`Litter Size: ${litterSize}`);
}

// output offspring
function output(mode) {
  let output = []; // all outputs to send to the dom

  if (mode === rollBreeding) {
    rollLitterSize();
    // litterSize = 1; // litterSize override
  } else {
    litterSize = 1;
  }

  if (litterSize !== 0) {
    for (let i = 0; i < litterSize; i++) {
      setupObjects();
      mode();
      // string = `Geno: ${offspring.geno}`;
      let string = `Geno: ${offspring.geno}
      Pheno: ${offspring.pheno}
      Sex: ${offspring.sex}
      Stats: ${offspring.stats}
      Lineage: ${offspring.lineage}
      Fertility: ${offspring.mutations}`;
      if (offspring.mutations !== false) {
        string += `
        Mutation: ${offspring.mutations}`;
      }
      if (offspring.defects !== false) {
        string += `
        Defect: ${offspring.defects}`;
      }
      string += `
      Traits: ${offspring.traits}`;
      output.push(string);
    }
  } else {
    output.push("Empty Litter");
  }

  for (let i = 0; i < output.length; i++) {
    let element = document.getElementById("output");

    if (i === 0) {
      element.innerText = ``;
      element.innerText += output[i];
    } else if (i >= 0) {
      element.innerText += `
      
      `;
      element.innerText += output[i];
    }
  }
}
