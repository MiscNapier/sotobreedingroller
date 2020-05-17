// roll litterSize
let litterSize = 0;
function rollLitterSize() {
  litterSize = rngRange(0, 6);

  console.log(litterSize);
}

// output offspring
function output(mode) {
  let output = [];
  let string;
  rollLitterSize();
  litterSize = 1; // litterSize override
  if (litterSize !== 0) {
    for (let i = 0; i < litterSize; i++) {
      mode();
      string = `Geno: ${offspring.geno}`;
      // string = `Geno: ${offspring.geno}
      // Pheno: ${offspring.pheno}
      // Sex: ${offspring.sex}
      // Stats: ${offspring.stats}
      // Lineage: ${offspring.lineage}
      // Fertility: ${offspring.mutations}`;
      // if (offspring.mutations !== false) {
      //   string += `
      //   Mutation: ${offspring.mutations}`;
      // }
      // if (offspring.defects !== false) {
      //   string += `
      //   Defect: ${offspring.defects}`;
      // }
      // string += `
      // Traits: ${offspring.traits}`;
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
