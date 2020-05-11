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

function expand(id) {
  let element = document.getElementById(id);
  
  if (element.style.display === "") {
    element.style.display = "none";
  } else if (element.style.display === "none") {
    element.style.display = "";
  }
}
