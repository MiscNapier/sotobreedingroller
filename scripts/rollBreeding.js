function rollBreeding() {
  function rollSex() {
    let x = rng(100);
    let sexList = [
      [60, "tom-cat"],
      [99, "she-cat"],
      [100, "sexless"],
    ];
    offspring.sex = rngList(sexList, 100);
    // console.log(offspring.sex);
  }

  function rollFertility() {
    if (offspring.sex === "sexless") {
      let fertilityList = [
        [1, "fertile"],
        [10, "infertile"],
      ];
      offspring.fertility = rngList(fertilityList, 10);
    } else {
      offspring.fertility = "fertile";
    }
    // console.log(offspring.fertility);
  }

  // FIXME: handle defect / mutation duplicates
  function rollDefectsMutations() {
    // setup bonuses
    let bonusDefects = 0;
    let bonusMutations = 0;

    if (fxi) {
      bonusDefects += 20;
      bonusMutations += 10;
    } else if (ixi) {
      bonusDefects += 50;
      bonusMutations += 50;
    }

    // mutations
    let mutationCount = rngList(
      [
        [10 + bonusMutations, 1],
        [15 + bonusMutations, 2],
        [100, 0],
      ],
      100
    );

    for (let i = 0; i < mutationCount; i++) {
      offspring.mutations.push(rngList(mutationsList, 100));
    }

    let inbreeding = false;
    if (inbreeding) {
      // defects
      let defectCount = rngList(
        [
          [12 + bonusDefects, 1],
          [17 + bonusDefects, 2],
          [20 + bonusDefects, 3],
          [100, 0],
        ],
        100
      );

      for (let i = 0; i < defectCount; i++) {
        offspring.defects.push(rngList(defectsList, 100));
      }

      // physical mutations
      if (defectCount === 0) {
        offspring.mutations.push(rngList(physicalMutationsList, 100));
      }
    }
  }

  // FIXME: handle trait duplicates
  function rollTraits() {
    let parentTraits = [
      sire.traits[0],
      sire.traits[1],
      sire.traits[2],
      dam.traits[0],
      dam.traits[1],
      dam.traits[2],
    ];

    for (let i = 0; i < 3; i++) {
      offspring.traits.push(randomizer(parentTraits));
    }
  }

  // call roll functions
  rollSex();
  rollFertility();
  rollDefectsMutations();
  rollTraits();
}
