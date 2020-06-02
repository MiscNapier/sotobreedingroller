// populate item select
populate(
  "itemPills",
  ["epimedium", "odd-eyed toad", "gilded feather", "lucky butterfly"],
  "pillSelect"
);

// populate parent selects
populate(
  "parentStatus",
  ["loner", "healer", "commoner", "warrior", "second", "leader"],
  "simple"
);
populate(
  "parentLineage",
  [/*"loner",*/ "viperus", "wildcat", "skirit", "kane"],
  "simple"
);
populate("parentFertility", ["fertile", "infertile"], "simple");
populate("parentMutations1", listPassableMuts, "optGroup");
populate("parentMutations2", listPassableMuts, "optGroup");
populate("parentTraits1", listTraits.positive, "simple");
populate("parentTraits2", listTraits.neutral, "simple");
populate("parentTraits3", listTraits.negative, "simple");

// populate sire/dam based on parent skeleton
function replaceBlock(original, replacement) {
  const blockOriginal = document.getElementById(original).innerHTML;
  // NOTE: regex is not safe, will be greedy with matches. Can be fixed by check that A) first character is capitilized or is preceded by a word-boundary and C) is followed by a capitilized character or word-boundary.
  const uppercaseRegex = new RegExp(original.capitalizeStr(), "g");
  const lowercaseRegex = new RegExp(original, "g");
  const blockReplacement = blockOriginal
    .replace(uppercaseRegex, replacement.capitalizeStr())
    .replace(lowercaseRegex, replacement);
  document.getElementById(replacement).innerHTML = blockReplacement;
}

replaceBlock("parent", "sire");
replaceBlock("parent", "dam");

// expand parents information
function expand(id) {
  let element = document.getElementById(id);

  if (element.style.display === "") {
    element.style.display = "none";
  } else if (element.style.display === "none") {
    element.style.display = "";
  }
}

// expand("sireExpand");
// expand("damExpand");

// populate for testing
// document.getElementById("sireGeno").value = `o/Bb/CrCr`;
// document.getElementById("damGeno").value = `Oo/Bb/nCr/AuAu`;
// document.getElementById("sireStats").value = `10	10	10	10	10	10	10	10	10	10	10	10`;
// document.getElementById("damStats").value = `3	10	3	3	10	0	0	0	0	0	0	0`;
