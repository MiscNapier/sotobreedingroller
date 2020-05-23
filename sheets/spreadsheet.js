let logbook = {};
function getLogbook() {
  getJSON(
    "https://spreadsheets.google.com/feeds/cells/1Y5TaI2RZMcLhVJLUL8ILA9u9mz1CIRvVTX3sqAbi6a8/od6/public/basic?alt=json",
    function (err, data) {
      let entry = data.feed.entry;
      let id;
      Object.keys(entry).forEach(function (key) {
        // populate logbook object with relevant information from .JSON
        // check if id column and create id entry in logbook
        if (entry[key].title.$t.search(/\bB\d+\b/) !== -1) {
          id = entry[key].content.$t;
          logbook[id] = {};
        }
        // check if geno column and add geno to id object
        if (entry[key].title.$t.search(/\bM\d+\b/) !== -1) {
          let geno = entry[key].content.$t;
          logbook[id].geno = geno;
        }
      });
    }
  );
}

// getLogbook();

// remove empty keys
// console.log(Object.keys(logbook));

// logbook cookie

// check for logbook cookie
// if logbook cookie isn't present get logbook and set cookie
