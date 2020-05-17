function rollRandom() {
  setupObjects();

  let black = randomizer(["BB", "Bb", "bb"]);
  let red = randomizer(["OO", "Oo", "oo"]);
  let markMod = [];
  for (let i = 0, x = rng(3); i < x; i++) {
    markMod.push(
      "n" +
        randomizer(
          randomizer([geneList.marksMods.common, geneList.marksMods.uncommon])
        )[1]
    );
    // markMod.push("n" + randomizer(randomizer([geneList.marksMods.common, geneList.marksMods.uncommon]))[1]);
  }
  markMod = markMod.filter(onlyUnique).sort().join("/");

  offspring.geno = [black, red, markMod].join("/");
}
