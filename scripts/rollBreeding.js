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
        [4 + bonusMutations, 1],
        [2 + bonusMutations, 2],
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

  function rollTraits() {
    let parentTraits = [
      sire.traits[0],
      sire.traits[1],
      sire.traits[2],
      dam.traits[0],
      dam.traits[1],
      dam.traits[2],
    ];

    if (parentTraits.indexOf("default") === -1) {
      for (let i = 0; i < 3; i++) {
        offspring.traits.push(randomizer(parentTraits));
      }
    }
  }

  function rollGeno() {
    // base genes
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

    // O/o || OO/Oo/oo
    let regexRed = /\b(O|o)(O|o|)\b/;
    if (sire.geno.search(regexRed) !== -1 && dam.geno.search(regexRed) !== -1) {
      let sortOrder = ["O", "o"];
      logicRed(regexRed);
    }

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

    // markings & modifiers
    // common
    /**
     * @param {string} gene
     */
    function logicMarksModsCommon(gene) {
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
        let odds = [[35, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(rec, rec)) {
        let odds = [
          [15, dom],
          [50, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, rec)) {
        let odds = [
          [65, dom],
          [100, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, dom)) {
        let odds = [[100, dom]];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, none)) {
        let odds = [[100, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
    }

    for (let i = 0; i < geneList.marksMods.common.length; i++) {
      logicMarksModsCommon(geneList.marksMods.common[i][1]);
    }

    // uncommon
    /**
     * @param {string} gene
     */
    function logicMarksModsUncommon(gene) {
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
        let odds = [[20, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(rec, rec)) {
        let odds = [
          [10, dom],
          [50, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, rec)) {
        let odds = [
          [30, dom],
          [90, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, dom)) {
        let odds = [
          [70, dom],
          [90, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, none)) {
        let odds = [[80, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
    }

    for (let i = 0; i < geneList.marksMods.uncommon.length; i++) {
      logicMarksModsUncommon(geneList.marksMods.uncommon[i][1]);
    }

    // rare
    /**
     * @param {string} gene
     */
    function logicMarksModsRare(gene) {
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
        let odds = [[5, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(rec, rec)) {
        let odds = [
          [5, dom],
          [35, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, rec)) {
        let odds = [
          [20, dom],
          [80, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, dom)) {
        let odds = [
          [50, dom],
          [85, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, none)) {
        let odds = [[60, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
    }

    for (let i = 0; i < geneList.marksMods.rare.length; i++) {
      logicMarksModsRare(geneList.marksMods.rare[i][1]);
    }

    // ultraRare
    /**
     * @param {string} gene
     */
    function logicMarksModsUltraRare(gene) {
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
        let odds = [[3, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(rec, rec)) {
        let odds = [
          [3, dom],
          [25, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, rec)) {
        let odds = [
          [7, dom],
          [60, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, dom)) {
        let odds = [
          [10, dom],
          [75, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, none)) {
        let odds = [[30, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
    }

    for (let i = 0; i < geneList.marksMods.ultraRare.length; i++) {
      logicMarksModsUltraRare(geneList.marksMods.ultraRare[i][1]);
    }

    // legendary
    /**
     * @param {string} gene
     */
    function logicMarksModsLegendary(gene) {
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
        let odds = [[1, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(rec, rec)) {
        let odds = [
          [1, dom],
          [4, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, rec)) {
        let odds = [
          [2, dom],
          [57, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, dom)) {
        let odds = [
          [5, dom],
          [50, rec],
        ];
        offspring.geno.push(rngList(odds, 100));
      }
      if (checkGene(dom, none)) {
        let odds = [[20, rec]];
        offspring.geno.push(rngList(odds, 100));
      }
    }

    for (let i = 0; i < geneList.marksMods.legendary.length; i++) {
      logicMarksModsLegendary(geneList.marksMods.legendary[i][1]);
    }

    // overrides
    // tabby override
    // TODO: implement 'no two tabby markings may exist together'
    // choose rarest tabby, else choose random tabby

    // modifier override
    // TODO: implement 'no two modifiers may exist together (with exceptions)'
  }

  function sanitize() {
    /**
     * @param {{ filter: (arg0: (value: any, index: any, self: any) => boolean) => any; join: (arg0: string) => { (): any; new (): any; capitalizeStr: { (): any; new (): any; }; }; }} array
     */
    function sanitizeArray(array) {
      array = array.filter(onlyUnique);
      return array.join(", ").capitalizeStr();
    }

    if (offspring.geno.length > 0) {
      offspring.geno = offspring.geno.filter(Boolean).join("/");
    } else {
      offspring.geno = "n/a";
    }

    if (offspring.pheno > 0) {
      // ?
    } else {
      offspring.pheno = "n/a";
    }

    offspring.sex = offspring.sex.capitalizeStr();

    if (offspring.stats.length > 0) {
      offspring.stats = sanitizeArray(offspring.stats);
    } else {
      offspring.stats = "n/a";
    }

    if (offspring.lineage.length > 0) {
      offspring.lineage = sanitizeArray(offspring.lineage);
    } else {
      offspring.lineage = "n/a";
    }

    offspring.fertility = offspring.fertility.capitalizeStr();

    if (offspring.mutations.length > 0) {
      offspring.mutations = sanitizeArray(offspring.mutations);
    } else {
      offspring.mutations = false;
    }

    if (offspring.defects.length > 0) {
      offspring.defects = sanitizeArray(offspring.defects);
    } else {
      offspring.defects = false;
    }

    if (offspring.traits.length > 0) {
      offspring.traits = sanitizeArray(offspring.traits);
    } else {
      offspring.traits = "n/a";
    }
  }

  // roll offspring
  rollSex();
  rollFertility();
  rollDefectsMutations();
  rollTraits();
  rollGeno();
  sanitize();
}
