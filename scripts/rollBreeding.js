// @ts-check

function rollBreeding() {
  function rollSex() {
    // @ts-ignore
    // @ts-ignore
    let x = rng(100);
    let sexList = [
      [60, "tom-cat"],
      [99, "she-cat"],
      [100, "sexless"],
    ];
    offspring.sex = rngList(sexList, x);
    // console.log(offspring.sex);
  }

  function rollStats() {
    // check if both parent stats are legal
    if (sire.stats.length !== 12 || dam.stats.length !== 12) {
      // error.push("Illegal stats present.");
      return;
    }

    // choose which stats to affect
    let x = [rng(12), rng(12), rng(12)];

    while (x[0] === x[1] || x[0] === x[2]) {
      x[0] = rng(12);
    }
    while (x[1] === x[2]) {
      x[1] = rng(12);
    }

    // setup
    x.sort();
    offspring.stats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < 3; i++) {
      // randomly choose sire or dam stat to pull from
      offspring.stats[x[i] - 1] =
        randomizer([sire.stats[x[i] - 1], dam.stats[x[i] - 1]]) * 0.1;

      // fix decimal
      if (offspring.stats[x[i] - 1] !== 0) {
        offspring.stats[x[i] - 1] = offspring.stats[x[i] - 1].toFixed(1);
      }
    }
  }

  function rollLineage() {
    // main lineage
    let newAdditional = [];
    let x = rng(100);
    if (x <= 45) {
      offspring.lineage[0] = sire.lineage;
      newAdditional[0] = dam.lineage;
    } else {
      offspring.lineage[0] = dam.lineage;
      newAdditional[0] = sire.lineage;
    }

    // check newAdditional
    if (offspring.lineage[0] === newAdditional[0]) {
      newAdditional = [];
    }

    // additional lineage
    offspring.lineage[1] = [...sire.lineageAdditional, ...dam.lineageAdditional, ...newAdditional];
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

  function rollMutationsDefects() {
    // setup bonuses
    let bonusDefects = 0;
    let bonusMutations = 0;
    // @ts-ignore
    let bonusPhysicalMutations = 0;
    let bonusViperus = 0;
    let bonusSkirit = 0;
    let bonusKane = 0;

    if (item.oddEyedToad) {
      bonusDefects += 20;
      bonusMutations += 20;
    }

    if (fxi) {
      bonusDefects += 20;
      bonusMutations += 10;
    } else if (ixi) {
      bonusDefects += 50;
      bonusMutations += 50;
    }

    /**
     * @param {string} lineage
     */
    function checkLineage(lineage) {
      return offspring.lineage.indexOf(lineage) !== -1 || false;
    }

    // if (checkLineage("loner")) {
    //   bonusMutations -= 10;
    //   bonusDefects += 10;
    // }
    if (checkLineage("viperus")) {
      bonusViperus += 10;
    }
    if (checkLineage("wildcat")) {
      bonusMutations += 10;
      bonusDefects -= 10;
    }
    if (checkLineage("skirit")) {
      bonusSkirit += 10;
    }
    if (checkLineage("kane")) {
      bonusKane += 10;
    }

    /**
     * @param {string} status
     */
    function checkStatus(status) {
      return (
        sire.status.indexOf(status) !== -1 ||
        dam.status.indexOf(status) !== -1 ||
        false
      );
    }

    if (checkStatus("loner")) {
      bonusPhysicalMutations += 10;
      bonusDefects += 5;
    }

    // mutations
    let mutationCount = rngList(
      [
        [4 + bonusMutations, 1],
        [2 + bonusMutations, 2],
        [100, 0],
      ],
      100
    );

    for (let i = 0; i < mutationCount; i++) {
      offspring.mutations.push(rngList(listRandomMuts, 100));
    }

    if (rng(100) <= bonusViperus) {
      offspring.mutations.push(randomizer(listBonusViperus));
    }
    if (rng(100) <= bonusSkirit) {
      offspring.mutations.push(randomizer(listBonusSkirit));
    }
    if (rng(100) <= bonusKane) {
      offspring.mutations.push(randomizer(listBonusKane));
    }

    // defects
    if (inbred && !item.epimedium) {
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
        offspring.defects.push(rngList(listDefects, 100));
      }

      // physical mutations
      if (defectCount === 0) {
        offspring.mutations.push(rngList(listRandomPhysMuts, 100));
      } else {
        // remove bonus physMuts override
        offspring.mutations = offspring.mutations
          .join(" ")
          .replace(
            /bobbed-tail|chimerism|doubled-eared|droopy-ears|elongated-limbs|elongated-tail|gigantism|maned|overgrown-fur|tailless|two-tailed/,
            ""
          )
          .replace(/\s\s/g, " ")
          .split(" ");
      }
    }
  }

  function rollTraits() {
    offspring.traits[0] = randomizer([sire.traits[0], dam.traits[0]]);
    offspring.traits[1] = randomizer([sire.traits[1], dam.traits[1]]);
    offspring.traits[2] = randomizer([sire.traits[2], dam.traits[2]]);
  }

  function rollGeno() {
    // base genes
    (() => {
      // black
      /**
       * @param {RegExp} regex
       * @param {string[]} sortOrder
       */
      function logicBasePunnet(regex, sortOrder) {
        let sireGene = sire.geno.match(regex);
        let damGene = dam.geno.match(regex);
        let p1 = [sireGene[1], damGene[1]];
        let p2 = [sireGene[1], damGene[2]];
        let p3 = [damGene[1], sireGene[2]];
        let p4 = [sireGene[2], damGene[2]];
        offspring.geno.push(
          sort(randomizer([p1, p2, p3, p4]), sortOrder).join("")
        );
      }

      // BB/Bb/bb
      let regexBlack = /\b(B|b)(B|b)\b/;
      if (
        sire.geno.search(regexBlack) !== -1 &&
        dam.geno.search(regexBlack) !== -1
      ) {
        let sortOrder = ["B", "b"];
        logicBasePunnet(regexBlack, sortOrder);
      }

      // red
      /**
       * @param {RegExp} regex
       */
      function logicRed(regex) {
        let sireGene = sire.geno.match(regex)[0];
        let damGene = dam.geno.match(regex)[0];
        // console.log(sireGene, damGene);

        let offspringGene;
        if (sireGene === "O" && damGene === "OO") {
          offspringGene = ["O", "O"];
        }
        if (sireGene === "o" && damGene === "OO") {
          offspringGene = ["O", "o"];
        }
        if (sireGene === "O" && damGene === "Oo") {
          offspringGene = randomizer([
            ["O", "O"],
            ["O", "o"],
          ]);
        }
        if (sireGene === "o" && damGene === "Oo") {
          offspringGene = randomizer([
            ["O", "o"],
            ["o", "o"],
          ]);
        }
        if (sireGene === "o" && damGene === "oo") {
          offspringGene = randomizer([["o", "o"]]);
        }

        if (offspringGene !== undefined) {
          if (offspring.sex === "tom-cat") {
            offspring.geno.push(randomizer(offspringGene));
          }
          if (offspring.sex === "she-cat" || offspring.sex === "sexless") {
            offspring.geno.push(offspringGene.join(""));
          }
        } else {
          error.push("Incompatible red genes present.");
        }
      }

      function femaleSireOverride() {
        let check = sire.geno.match(/\b(OO|Oo|oo)\b/) || false;
        if (!check) return;
        sire.geno = sire.geno
          .replace(/\b(OO|Oo)\b/, "O")
          .replace(/\boo\b/, "o");
        error.push("Sire with she-cat red overriden.");
      }

      function maleDamOverride() {
        let check = dam.geno.match(/\b(O|o)\b/) || false;
        if (!check) return;
        dam.geno = dam.geno.replace(/\b(O)\b/, "OO").replace(/\bo\b/, "oo");
        error.push("Dam with tom-cat red overriden.");
      }

      // O/o || OO/Oo/oo
      let regexRed = /\b(O|o)(O|o|)\b/;
      if (
        sire.geno.search(regexRed) !== -1 &&
        dam.geno.search(regexRed) !== -1
      ) {
        femaleSireOverride();
        maleDamOverride();
        console.log(sire.geno, dam.geno);
        logicRed(regexRed);
      }
    })();

    // markings & modifiers
    (() => {
      // setup bonuses
      let bonusMarkings = 0;
      let bonusModifiers = 0;
      let bonusHealer = 0;
      let bonusCommoner = 0;
      let bonusWarrior = 0;
      let bonusSecond = 0;
      let bonusLeader = 0;

      // lineage bonuses
      /**
       * @param {string} lineage
       */
      function checkLineage(lineage) {
        return offspring.lineage.indexOf(lineage) !== -1 || false;
      }

      if (checkLineage("wildcat")) {
        bonusMarkings += 5;
      }

      // status bonuses
      /**
       * @param {string} status
       */
      function checkStatus(status) {
        return (
          sire.status.indexOf(status) !== -1 ||
          dam.status.indexOf(status) !== -1 ||
          false
        );
      }

      if (checkStatus("healer")) {
        bonusHealer += 10;
      }
      if (checkStatus("commoner")) {
        bonusCommoner += 5;
      }
      if (checkStatus("warrior")) {
        bonusWarrior += 5;
      }
      if (checkStatus("second")) {
        bonusSecond += 5;
      }
      if (checkStatus("leader")) {
        bonusLeader += 5;
      }

      // common
      /**
       * @param {string} gene
       * @param {number} bonus
       */
      function logicMarksModsCommon(gene, bonus) {
        let dom = `${gene}${gene}`;
        let rec = `n${gene}`;
        let none = false;
        let regexVar = `\\b(${dom}|${rec})\\b`;
        let regex = new RegExp(regexVar, "");
        let sireGene =
          sire.geno.match(regex) !== null ? sire.geno.match(regex)[1] : false;
        let damGene =
          dam.geno.match(regex) !== null ? dam.geno.match(regex)[1] : false;

        /**
         * @param {string} geneA
         * @param {string|boolean} geneB
         */
        function checkGene(geneA, geneB) {
          return (
            (sireGene === geneA && damGene === geneB) ||
            (sireGene === geneB && damGene === geneA) ||
            false
          );
        }

        if (checkGene(rec, none)) {
          let odds = [[35 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(rec, rec)) {
          let odds = [
            [15 + bonus, dom],
            [50 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, rec)) {
          let odds = [
            [65 + bonus, dom],
            [100 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, dom)) {
          let odds = [[100 + bonus, dom]];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, none)) {
          let odds = [[100 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
      }

      for (let i = 0; i < listMarksMods.common.length; i++) {
        if (listMarksMods.common[i][2] === "marking") {
          let bonus =
            bonusMarkings +
            bonusHealer +
            bonusCommoner +
            bonusWarrior +
            bonusSecond +
            bonusLeader;
          logicMarksModsCommon(listMarksMods.common[i][1], bonus);
        }
        if (listMarksMods.common[i][2] === "modifier") {
          logicMarksModsCommon(listMarksMods.common[i][1], bonusModifiers);
        }
      }

      // uncommon
      /**
       * @param {string} gene
       * @param {number} bonus
       */
      function logicMarksModsUncommon(gene, bonus) {
        let dom = `${gene}${gene}`;
        let rec = `n${gene}`;
        let none = false;
        let regexVar = `\\b(${dom}|${rec})\\b`;
        let regex = new RegExp(regexVar, "");
        let sireGene =
          sire.geno.match(regex) !== null ? sire.geno.match(regex)[1] : false;
        let damGene =
          dam.geno.match(regex) !== null ? dam.geno.match(regex)[1] : false;

        /**
         * @param {string} geneA
         * @param {string|boolean} geneB
         */
        function checkGene(geneA, geneB) {
          return (
            (sireGene === geneA && damGene === geneB) ||
            (sireGene === geneB && damGene === geneA) ||
            false
          );
        }

        if (checkGene(rec, none)) {
          let odds = [[20 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(rec, rec)) {
          let odds = [
            [10 + bonus, dom],
            [50 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, rec)) {
          let odds = [
            [30 + bonus, dom],
            [90 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, dom)) {
          let odds = [
            [70 + bonus, dom],
            [90 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, none)) {
          let odds = [[80 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
      }

      for (let i = 0; i < listMarksMods.uncommon.length; i++) {
        if (listMarksMods.uncommon[i][2] === "marking") {
          let bonus =
            bonusMarkings +
            bonusHealer +
            bonusWarrior +
            bonusSecond +
            bonusLeader;
          logicMarksModsUncommon(listMarksMods.uncommon[i][1], bonus);
        }
        if (listMarksMods.uncommon[i][2] === "modifier") {
          logicMarksModsUncommon(listMarksMods.uncommon[i][1], bonusModifiers);
        }
      }

      // rare
      /**
       * @param {string} gene
       * @param {number} bonus
       */
      function logicMarksModsRare(gene, bonus) {
        let dom = `${gene}${gene}`;
        let rec = `n${gene}`;
        let none = false;
        let regexVar = `\\b(${dom}|${rec})\\b`;
        let regex = new RegExp(regexVar, "");
        let sireGene =
          sire.geno.match(regex) !== null ? sire.geno.match(regex)[1] : false;
        let damGene =
          dam.geno.match(regex) !== null ? dam.geno.match(regex)[1] : false;

        /**
         * @param {string} geneA
         * @param {string|boolean} geneB
         */
        function checkGene(geneA, geneB) {
          return (
            (sireGene === geneA && damGene === geneB) ||
            (sireGene === geneB && damGene === geneA) ||
            false
          );
        }

        if (checkGene(rec, none)) {
          let odds = [[5 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(rec, rec)) {
          let odds = [
            [5 + bonus, dom],
            [35 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, rec)) {
          let odds = [
            [20 + bonus, dom],
            [80 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, dom)) {
          let odds = [
            [50 + bonus, dom],
            [85 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, none)) {
          let odds = [[60 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
      }

      for (let i = 0; i < listMarksMods.rare.length; i++) {
        if (listMarksMods.rare[i][2] === "marking") {
          let bonus = bonusMarkings + bonusSecond + bonusLeader;
          logicMarksModsRare(listMarksMods.rare[i][1], bonus);
        }
        if (listMarksMods.rare[i][2] === "modifier") {
          logicMarksModsRare(listMarksMods.rare[i][1], bonusModifiers);
        }
      }

      // ultraRare
      /**
       * @param {string} gene
       * @param {number} bonus
       */
      function logicMarksModsUltraRare(gene, bonus) {
        let dom = `${gene}${gene}`;
        let rec = `n${gene}`;
        let none = false;
        let regexVar = `\\b(${dom}|${rec})\\b`;
        let regex = new RegExp(regexVar, "");
        let sireGene =
          sire.geno.match(regex) !== null ? sire.geno.match(regex)[1] : false;
        let damGene =
          dam.geno.match(regex) !== null ? dam.geno.match(regex)[1] : false;

        /**
         * @param {string} geneA
         * @param {string|boolean} geneB
         */
        function checkGene(geneA, geneB) {
          return (
            (sireGene === geneA && damGene === geneB) ||
            (sireGene === geneB && damGene === geneA) ||
            false
          );
        }

        if (checkGene(rec, none)) {
          let odds = [[3 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(rec, rec)) {
          let odds = [
            [3 + bonus, dom],
            [25 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, rec)) {
          let odds = [
            [7 + bonus, dom],
            [60 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, dom)) {
          let odds = [
            [10 + bonus, dom],
            [75 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, none)) {
          let odds = [[30 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
      }

      for (let i = 0; i < listMarksMods.ultraRare.length; i++) {
        if (listMarksMods.ultraRare[i][2] === "marking") {
          let bonus = bonusMarkings;
          logicMarksModsUltraRare(listMarksMods.ultraRare[i][1], bonus);
        }
        if (listMarksMods.ultraRare[i][2] === "modifier") {
          logicMarksModsUltraRare(
            listMarksMods.ultraRare[i][1],
            bonusModifiers
          );
        }
      }

      // legendary
      /**
       * @param {string} gene
       * @param {number} bonus
       */
      function logicMarksModsLegendary(gene, bonus) {
        let dom = `${gene}${gene}`;
        let rec = `n${gene}`;
        let none = false;
        let regexVar = `\\b(${dom}|${rec})\\b`;
        let regex = new RegExp(regexVar, "");
        let sireGene =
          sire.geno.match(regex) !== null ? sire.geno.match(regex)[1] : false;
        let damGene =
          dam.geno.match(regex) !== null ? dam.geno.match(regex)[1] : false;

        /**
         * @param {string} geneA
         * @param {string|boolean} geneB
         */
        function checkGene(geneA, geneB) {
          return (
            (sireGene === geneA && damGene === geneB) ||
            (sireGene === geneB && damGene === geneA) ||
            false
          );
        }

        if (checkGene(rec, none)) {
          let odds = [[1 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(rec, rec)) {
          let odds = [
            [1 + bonus, dom],
            [4 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, rec)) {
          let odds = [
            [2 + bonus, dom],
            [57 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, dom)) {
          let odds = [
            [5 + bonus, dom],
            [50 + bonus, rec],
          ];
          offspring.geno.push(rngList(odds, 100));
        }
        if (checkGene(dom, none)) {
          let odds = [[20 + bonus, rec]];
          offspring.geno.push(rngList(odds, 100));
        }
      }

      for (let i = 0; i < listMarksMods.legendary.length; i++) {
        if (listMarksMods.legendary[i][2] === "marking") {
          let bonus = bonusMarkings;
          logicMarksModsLegendary(listMarksMods.legendary[i][1], bonus);
        }
        if (listMarksMods.legendary[i][2] === "modifier") {
          logicMarksModsLegendary(
            listMarksMods.legendary[i][1],
            bonusModifiers
          );
        }
      }
    })();

    // mutations
    (() => {
      // setup
      let sireMut = sire.mutations;
      let damMut = dam.mutations;
      let checkPassableMuts = false;

      // setup bonuses
      let bonusMutations = 0;
      let bonusViperus = 0;
      let bonusSkirit = 0;
      let bonusKane = 0;

      if (item.oddEyedToad) {
        bonusMutations += 20;
      }

      if (item.lucyButterfly) {
        bonusMutations += 10;
      }

      if (fxi) {
        bonusMutations += 10;
      } else if (ixi) {
        bonusMutations += 50;
      }

      /**
       * @param {string} lineage
       */
      function checkLineage(lineage) {
        return offspring.lineage.indexOf(lineage) !== -1 || false;
      }

      // loner removed from lineage by client's request
      // if (checkLineage("loner")) {
      //   bonusMutations -= 10;
      // }
      if (checkLineage("viperus")) {
        bonusViperus += 10;
      }
      if (checkLineage("wildcat")) {
        bonusMutations += 10;
      }
      if (checkLineage("skirit")) {
        bonusSkirit += 10;
      }
      if (checkLineage("kane")) {
        bonusKane += 10;
      }

      // logic
      /**
       * @param {number} odds
       * @param {string} gene
       */
      function logicMutation(odds, gene) {
        let bonus = bonusMutations;

        if (listBonusViperus.indexOf(gene) !== -1) {
          bonus += bonusViperus;
        }
        if (listBonusSkirit.indexOf(gene) !== -1) {
          bonus += bonusSkirit;
        }
        if (listBonusKane.indexOf(gene) !== -1) {
          bonus += bonusKane;
        }

        let check = sireMut.indexOf(gene) !== -1 || damMut.indexOf(gene) !== -1;
        if (check) {
          checkPassableMuts = true;
        }
        if (gene.search(/piebaldism/) !== -1) {
          gene = "bicolor";
        }
        if (check && rng(100) + bonus <= odds) {
          offspring.mutations.push(gene);
        }
      }

      function rollPassableMuts() {
        for (let i = 0; i < listPassableMuts.common.length; i++) {
          logicMutation(20, listPassableMuts.common[i]);
        }
        for (let i = 0; i < listPassableMuts.uncommon.length; i++) {
          logicMutation(15, listPassableMuts.uncommon[i]);
        }
        for (let i = 0; i < listPassableMuts.rare.length; i++) {
          logicMutation(10, listPassableMuts.rare[i]);
        }
        for (let i = 0; i < listPassableMuts.ultraRare.length; i++) {
          logicMutation(5, listPassableMuts.ultraRare[i]);
        }
        for (let i = 0; i < listPassableMuts.legendary.length; i++) {
          logicMutation(1, listPassableMuts.legendary[i]);
        }
      }

      let countLuckyButterfly = offspring.mutations.length;
      rollPassableMuts();
      if (
        item.luckyButterfly &&
        checkPassableMuts &&
        offspring.mutations.length === countLuckyButterfly
      ) {
        while (offspring.mutations.length === countLuckyButterfly) {
          rollPassableMuts();
        }
      }
    })();

    // overrides
    (() => {
      // convert offspring.geno type
      offspring.geno = offspring.geno.join(" ");

      // tabby override
      (() => {
        // FIXME: breaks if fed an empty rarity. See modifier override for updated version if necessary.

        // setup
        let regexCommon = new RegExp(`${listTabbyRegex.common}`, "g");
        let regexUncommon = new RegExp(`${listTabbyRegex.uncommon}`, "g");
        let regexRare = new RegExp(`${listTabbyRegex.rare}`, "g");
        // @ts-ignore
        // @ts-ignore
        let regexUltraRare = new RegExp(`${listTabbyRegex.ultraRare}`, "g");
        // @ts-ignore
        // @ts-ignore
        let regexLegendary = new RegExp(`${listTabbyRegex.legendary}`, "g");

        // rarity
        if (offspring.geno.search(regexRare) !== -1) {
          offspring.geno = offspring.geno
            .replace(regexCommon, "")
            .replace(regexUncommon, "");
        }
        if (offspring.geno.search(regexUncommon) !== -1) {
          offspring.geno = offspring.geno.replace(regexCommon, "");
        }

        // single random
        let listRegexAll = [
          listTabbyRegex.common,
          listTabbyRegex.uncommon,
          listTabbyRegex.rare,
          // listTabbyRegex.ultraRare,
          // listTabbyRegex.legendary,
        ].join("|");
        let regexAll = new RegExp(`${listRegexAll}`, "g");
        // console.log(listRegexAll);

        let check = offspring.geno.search(regexAll) !== -1 || false;
        if (!check) return;
        let selected = randomizer(offspring.geno.match(regexAll));
        let regexSelected = new RegExp(`${selected}`);
        listRegexAll = listRegexAll
          .replace(regexSelected, "")
          .replace(/\|\|/g, "|")
          .replace(/^\|/, "");
        let regexRemove = new RegExp(`${listRegexAll}`, "g");
        offspring.geno = offspring.geno.replace(regexRemove, "");
      })();

      // modifier override
      (() => {
        // setup
        let regexCommon = new RegExp(`${listModifierRegex.common}`, "g");
        let regexUncommon = new RegExp(`${listModifierRegex.uncommon}`, "g");
        let regexRare = new RegExp(`${listModifierRegex.rare}`, "g");
        // @ts-ignore
        // @ts-ignore
        let regexUltraRare = new RegExp(`${listModifierRegex.ultraRare}`, "g");
        // @ts-ignore
        // @ts-ignore
        let regexLegendary = new RegExp(`${listModifierRegex.legendary}`, "g");

        // rarity
        if (offspring.geno.search(regexRare) !== -1) {
          offspring.geno = offspring.geno
            .replace(regexCommon, "")
            .replace(regexUncommon, "");
        }
        if (offspring.geno.search(regexUncommon) !== -1) {
          offspring.geno = offspring.geno.replace(regexCommon, "");
        }

        // single random
        let listRegexAll = [
          listModifierRegex.common,
          listModifierRegex.uncommon,
          listModifierRegex.rare,
          listModifierRegex.ultraRare,
          listModifierRegex.legendary,
        ]
          .filter(Boolean)
          .join("|");
        let regexAll = new RegExp(`${listRegexAll}`, "g");

        let check = offspring.geno.search(regexAll) !== -1 || false;
        if (!check) return;
        let selected = randomizer(offspring.geno.match(regexAll));
        let regexSelected = new RegExp(`${selected}`);
        listRegexAll = listRegexAll
          .replace(regexSelected, "")
          .replace(/\|\|/g, "|")
          .replace(/^\|/, "");
        let regexRemove = new RegExp(`${listRegexAll}`, "g");
        offspring.geno = offspring.geno.replace(regexRemove, "");
      })();

      // revert offspring.geno type
      offspring.geno = offspring.geno.split(" ");
    })();
  }

  function readPheno() {
    // setup
    // @ts-ignore
    window.genoString = offspring.geno.join(" ");
    // id1 = offspring.pheno[0];
    // id2 = offspring.pheno[1];
    // idBase = offspring.pheno[2];
    // id3 = offspring.pheno[3];
    // id4 = offspring.pheno[4];
    // id5 = offspring.pheno[5];

    // logic
    // base
    /**
     * @param {array} list
     */
    function logicBase(list) {
      for (let i = 0; i < list.length; i++) {
        let gene = list[i][1];
        let regex = new RegExp(`\\b${gene}\\b`);

        // @ts-ignore
        if (genoString.search(regex) !== -1) {
          // FIXME: // had to do with legacy reset pheno in sexless and chimerism, should be fixed now, test further
          // Uncaught TypeError: Cannot read property 'push' of undefined
          // at logicBase (rollBreeding.js:945)
          // at readPheno (rollBreeding.js:950)
          // at handleSexless (rollBreeding.js:1099)
          offspring.pheno[2].push(list[i][0][0]);
          if (list[i][0].length === 2) {
            offspring.pheno[2].push("and");
            offspring.pheno[2].push(list[i][0][1]);
          }
        }
      }
    }

    logicBase(listPhenoOrder.idBase);

    let checkRedPlus =
      (offspring.pheno[2].indexOf("red") !== -1 &&
        offspring.pheno[2].indexOf("black") !== -1) ||
      (offspring.pheno[2].indexOf("red") !== -1 &&
        offspring.pheno[2].indexOf("chocolate") !== -1);
    let checkBicolorPiebaldism =
      // @ts-ignore
      genoString.search(/nBi|BiBi/) !== -1 ||
      offspring.mutations.join(" ").search(/piebaldism/) !== -1;
    if (checkRedPlus && checkBicolorPiebaldism) {
      offspring.pheno[2].push("calico");
    }

    // markings & modifiers
    /**
     * @param {array} list
     * @param {number} pos
     */
    function logicMarkMod(list, pos) {
      for (let i = 0; i < list.length; i++) {
        let gene = list[i][1];
        let regex = new RegExp(`\\b(n${gene}|${gene}${gene})\\b`);

        // @ts-ignore
        if (genoString.search(regex) !== -1) {
          offspring.pheno[pos].push(list[i][0]);
        }

        if (
          pos === 4 &&
          offspring.pheno[pos].length > 0 &&
          offspring.pheno[pos].indexOf("with") === -1
        ) {
          offspring.pheno[pos].unshift("with");
        }
        if (
          pos === 5 &&
          offspring.pheno[pos].length > 1 &&
          offspring.pheno[pos].indexOf("and") === -1
        ) {
          offspring.pheno[pos].splice(-1, 0, "and");
        }
      }
    }

    logicMarkMod(listPhenoOrder.id1, 0);
    logicMarkMod(listPhenoOrder.id2, 1);
    logicMarkMod(listPhenoOrder.id3, 3);
    logicMarkMod(listPhenoOrder.id4, 4);
    logicMarkMod(listPhenoOrder.id5, 5);

    // exceptions
    offspring.pheno = [].concat.apply([], offspring.pheno);

    /**
     * @param {array} haystack
     * @param {string} needle
     * @param {string} newNeedle
     */
    function arrayReplace(haystack, needle, newNeedle) {
      let pos = haystack.indexOf(needle);
      if (pos !== -1) {
        haystack[pos] = newNeedle;
      }
    }

    if (offspring.geno.indexOf("CrCr") !== -1) {
      arrayReplace(offspring.pheno, "cream", "double-cream");
    }
    if (offspring.geno.indexOf("MbMb") !== -1) {
      arrayReplace(offspring.pheno, "marbled", "dominant-marbled");
    }
    if (offspring.geno.indexOf("OpOp") !== -1) {
      arrayReplace(offspring.pheno, "opaline", "dominant-opaline");
    }

    /**
     * @param {object} exception
     */
    function logicException(exception) {
      let base = exception[0][0];

      if (offspring.pheno.indexOf(base) !== -1) {
        for (let i = 0; i < exception[1].length; i++) {
          let phene = exception[1][i][0];
          let gene = exception[1][i][1];
          let checkException = exception[1][i][2];
          let newGene = exception[1][i][3];

          if (checkException(gene)) {
            arrayReplace(offspring.pheno, base, newGene);
            arrayReplace(offspring.pheno, phene, "");
          }
        }
      }
    }

    // tier 1
    // @ts-ignore
    for (let [key] of Object.entries(listExceptionsTier1)) {
      logicException(listExceptionsTier1[key]);
    }

    // tier 2
    // @ts-ignore
    for (let [key] of Object.entries(listExceptionsTier2)) {
      logicException(listExceptionsTier2[key]);
    }
  }

  function handleChimerism() {
    let check = offspring.mutations.indexOf("chimerism") !== -1 || false;
    if (!check) return;

    // setup chimera object
    let chimera = {};
    function setupChimera() {
      chimera = {
        geno: offspring.geno,
        pheno: offspring.pheno,
      };
    }

    // roll first gene
    rollLineage();
    rollFertility();
    rollMutationsDefects();
    rollTraits();
    rollGeno();
    readPheno();
    setupChimera();

    // roll second gene
    offspring.geno = [];
    offspring.pheno = [[], [], [], [], [], []];
    rollGeno();
    readPheno();

    // merge
    chimera.geno.push("||");
    chimera.pheno.push("||");
    offspring.geno = chimera.geno.concat(offspring.geno);
    offspring.pheno = chimera.pheno.concat(offspring.pheno);
  }

  function handleSexed() {
    rollStats();
    rollLineage();
    rollFertility();
    rollMutationsDefects();
    rollTraits();
    rollGeno();
    readPheno();
    // offspring.mutations = ["chimerism"]; // mutation testing
    handleChimerism();
  }

  function handleSexless() {
    // setup chimera object
    let chimera = {};
    function setupChimera() {
      chimera = {
        geno: offspring.geno,
        pheno: offspring.pheno,
      };
    }

    // roll male gene
    offspring.sex = "tom-cat";
    rollStats();
    rollLineage();
    rollFertility();
    rollMutationsDefects();
    rollTraits();
    rollGeno();
    readPheno();
    setupChimera();
    // TODO: remove chimerism mutation if sexless

    // roll female gene
    offspring.sex = "she-cat";
    offspring.geno = [];
    offspring.pheno = [[], [], [], [], [], []];
    rollGeno();
    readPheno();

    // merge
    offspring.sex = "sexless";
    chimera.geno.push("||");
    chimera.pheno.push("||");
    offspring.geno = chimera.geno.concat(offspring.geno);
    offspring.pheno = chimera.pheno.concat(offspring.pheno);
  }

  function sanitize() {
    // sanitizeArray() function
    /**
     * @param {{ filter: (arg0: (value: any, index: any, self: any) => boolean) => any; join: (arg0: string) => { (): any; new (): any; capitalizeStr: { (): any; new (): any; }; }; }} array
     */
    function sanitizeArray(array) {
      array = array.filter(onlyUnique);
      return array.join(", ").capitalizeStr();
    }

    // geno
    if (offspring.geno.length > 0) {
      offspring.geno = offspring.geno
        .filter(Boolean)
        .join("/")
        .replace(/\/\|\|\//, " || ");
    } else {
      offspring.geno = "n/a";
    }

    // pheno
    if ([].concat.apply([], offspring.pheno).length > 0) {
      offspring.pheno = offspring.pheno
        .filter(Boolean)
        .join(", ")
        .capitalizeStr()
        .replace(/, Calico,/, " Calico,")
        .replace(/, With,/, " with")
        .replace(/, And,/, " and")
        .replace(/, \|\|,/, " ||");
    } else {
      offspring.pheno = "n/a";
    }

    // sex
    offspring.sex = offspring.sex.capitalizeStr();

    // stats
    if (offspring.stats.length > 0) {
      let s = offspring.stats;
      offspring.stats = `AG ${s[0]} | CH ${s[1]} | CR ${s[2]} | DI ${s[3]} | EN ${s[4]} | IN ${s[5]} | LU ${s[6]} | PI ${s[7]} | PO ${s[8]} | ST ${s[9]} | VI ${s[10]} | WI ${s[11]}`;
    } else {
      offspring.stats = "n/a";
    }

    // lineage
    if (offspring.lineage[0].indexOf("default") === -1) {
      offspring.lineage[0] = offspring.lineage[0].toUpperCase();
      if (offspring.lineage[1].length !== 0) {
        console.log(offspring.lineage[1]);
        offspring.lineage[1] = sanitizeArray(offspring.lineage[1]);
        offspring.lineage = `${offspring.lineage[0]} | ${offspring.lineage[1]}`;
      } else {
        offspring.lineage = offspring.lineage[0];
      }
    } else {
      offspring.lineage = "n/a";
    }

    // fertility
    offspring.fertility = offspring.fertility.capitalizeStr();

    // mutations
    // single random
    /**
     * @param {array} input
     * @param {object} list
     */
    function singleRandom(input, list) {
      // setup
      let inputString = input.join(" ");

      // rarity
      let regexCommon = new RegExp(`${list.common}`, "g");
      let regexUncommon = new RegExp(`${list.uncommon}`, "g");
      let regexRare = new RegExp(`${list.rare}`, "g");
      let regexUltraRare = new RegExp(`${list.ultraRare}`, "g");
      let regexLegendary = new RegExp(`${list.legendary}`, "g");

      if (
        list.legendary != false &&
        inputString.search(regexLegendary) !== -1
      ) {
        inputString = inputString
          .replace(regexCommon, "")
          .replace(regexUncommon, "")
          .replace(regexRare, "")
          .replace(regexUltraRare, "");
      }
      if (
        list.ultraRare != false &&
        inputString.search(regexUltraRare) !== -1
      ) {
        inputString = inputString
          .replace(regexCommon, "")
          .replace(regexUncommon, "")
          .replace(regexRare, "");
      }
      if (list.rare != false && inputString.search(regexRare) !== -1) {
        inputString = inputString
          .replace(regexCommon, "")
          .replace(regexUncommon, "");
      }
      if (list.uncommon != false && inputString.search(regexUncommon) !== -1) {
        inputString = inputString.replace(regexCommon, "");
      }

      // single random
      let listRegexAll = [
        list.common,
        list.uncommon,
        list.rare,
        list.ultraRare,
        list.legendary,
      ]
        .filter(Boolean)
        .join("|");
      let regexAll = new RegExp(`${listRegexAll}`, "g");

      let check = inputString.search(regexAll) !== -1;
      if (!check) return inputString.split(" ").filter(Boolean);
      let selected = randomizer(inputString.match(regexAll));
      let regexSelected = new RegExp(`${selected}`);
      listRegexAll = listRegexAll
        .replace(regexSelected, "")
        .replace(/\|\|/g, "|")
        .replace(/^\|/, "");
      let regexRemove = new RegExp(`${listRegexAll}`, "g");
      inputString = inputString.replace(regexRemove, "");

      // return
      return inputString.split(" ").filter(Boolean);
    }

    if (offspring.mutations.length > 0) {
      offspring.mutations = singleRandom(offspring.mutations, listFurRegex);
      offspring.mutations = singleRandom(
        offspring.mutations,
        listPiebaldismRegex
      );
      offspring.mutations = singleRandom(
        offspring.mutations,
        listVitiligoRegex
      );
      offspring.mutations = sanitizeArray(offspring.mutations);
    } else {
      offspring.mutations = false;
    }

    // defects
    if (offspring.defects.length > 0) {
      offspring.defects = sanitizeArray(offspring.defects);
    } else {
      offspring.defects = false;
    }

    // traits
    offspring.traits = [].concat.apply([], offspring.traits);
    if (offspring.traits.indexOf("default") === -1) {
      offspring.traits = sanitizeArray(offspring.traits);
    } else {
      offspring.traits = "n/a";
    }
  }

  // roll offspring
  rollSex();
  // offspring.sex = "sexless"; // sex testing injection
  if (offspring.sex === "sexless") {
    handleSexless();
  } else {
    handleSexed();
  }
  sanitize();
}
