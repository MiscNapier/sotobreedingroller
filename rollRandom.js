function rollRandom() {
  let black = randomizer(["BB", "Bb", "bb"]);
  let red = randomizer(["OO", "Oo", "oo"]);
  let markMod = "n" + randomizer(randomizer([geneList.marksMods.common, geneList.marksMods.uncommon]))[1];

  return offspring.geno = [black, red, markMod].join("/");
}
