function rollRandom() {
  setupObjects();

  let black = randomizer(["BB", "Bb", "bb"]);
  let red = randomizer(["OO", "Oo", "oo"]);
  let markMod = [];
  for (let i = 0, x = rng(3); i < x; i++) {
    markMod.push(
      "n" +
        randomizer(
          randomizer([listMarksMods.common, listMarksMods.uncommon])
        )[1]
    );
  }
  markMod = markMod.filter(onlyUnique).sort().join(" ");

  offspring.geno = [black, red, markMod].join(" ");

  // read pheno
  (() => {
    // setup
    // @ts-ignore
    window.genoString = offspring.geno;
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
  })();

  // sanitize
  (() => {
    // geno
    offspring.geno = offspring.geno.replace(/\s/g, "/");

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
  })();
}
