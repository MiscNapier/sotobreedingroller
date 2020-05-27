// @ts-check

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

  function rollStats() {
    if (sire.stats.length !== 12 || dam.stats.length !== 12) {
      // error.push("Illegal stats present.");
      return;
    }
    for (let i = 0; i < 12; i++) {
      // code & things :D
    }
  }

  function rollLineage() {
    let odds = [
      [45, sire.lineage],
      [100, dam.lineage],
    ];
    offspring.lineage.push(rngList(odds, 100));
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

    if (checkLineage("loner")) {
      bonusMutations -= 10;
      bonusDefects += 10;
    }
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
      offspring.mutations.push(randomizer(listRandomMutsBonusViperus));
    }

    // defects
    let inbreeding = false; // testing:
    if (inbreeding && !item.epimedium) {
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

        if (rng(100) <= bonusViperus) {
          offspring.mutations.push(randomizer(listRandomPhysMutsBonusViperus));
        }
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
      sire.geno = sire.geno.replace(/\b(OO|Oo)\b/, "O").replace(/\boo\b/, "o");
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
    if (sire.geno.search(regexRed) !== -1 && dam.geno.search(regexRed) !== -1) {
      femaleSireOverride();
      maleDamOverride();
      logicRed(regexRed);
    }

    // markings & modifiers
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
        logicMarksModsUltraRare(listMarksMods.ultraRare[i][1], bonusModifiers);
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
        logicMarksModsLegendary(listMarksMods.legendary[i][1], bonusModifiers);
      }
    }

    // overrides
    // tabby override
    /**
     * @param {string} rarity
     */
    function checkTabby(rarity) {}
    // console.log(checkTabby("common"));

    // modifier override
    // TODO: implement 'no two modifiers may exist together (with exceptions)'
  }

  function readPheno() {}

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
    offspring.pheno = [];
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
    offspring.pheno = [];
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
    if (offspring.pheno > 0) {
      // ?
    } else {
      offspring.pheno = "n/a";
    }

    // sex
    offspring.sex = offspring.sex.capitalizeStr();

    // stats
    if (offspring.stats.length > 0) {
      offspring.stats = sanitizeArray(offspring.stats);
    } else {
      offspring.stats = "n/a";
    }

    // lineage
    if (
      offspring.lineage.length > 0 &&
      offspring.lineage.indexOf("default") === -1
    ) {
      offspring.lineage = sanitizeArray(offspring.lineage);
    } else {
      offspring.lineage = "n/a";
    }

    // fertility
    offspring.fertility = offspring.fertility.capitalizeStr();

    // mutations
    if (offspring.mutations.length > 0) {
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
  // offspring.sex = "tom-cat"; // sex testing
  if (offspring.sex === "sexless") {
    handleSexless();
  } else {
    handleSexed();
  }
  sanitize();
}
