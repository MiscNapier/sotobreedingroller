// Version
// 1.1

// Snippets
// .replace(/(,\s)(?!.*\1)/, ' and ') <-- find last instance

// functions
function browserCheck() {
  if (window.chrome) {
    browser.style.display = "none";
  }
}

// set cookie
function setCookie(cname, cvalue, exdays) {
  // https://bytenota.com/javascript-how-to-save-an-object-in-cookie/
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// get cookie
function getCookie(cname) {
  // https://bytenota.com/javascript-how-to-save-an-object-in-cookie/
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// get JSON
function getJSON(url, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    let status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

// check if object is empty
function isEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

// remove falsy keys
const removeFalsy = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((prop) => {
    console.log(obj[prop]);
    if (obj[prop]) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

// reload site
function reload() {
  window.location.reload(false);
}

// select all output
function selectText(containerid) {
  if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
}

function rng(max) {
  const rng = Math.floor(Math.random() * max) + 1;
  return rng;
}

function rngRange(min, max) {
  const rng = Math.floor(Math.random() * (max - min + 1)) + min;
  return rng;
}

function randomizer(array) {
  // console.log(array);
  if (array.length > 0) {
    const random = array[Math.floor(Math.random() * array.length)];
    return random;
  } else {
    return "";
  }
}

// remove duplicates from array
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
// let a = ['a', 1, 'a', 2, '1'];
// let unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']

// return array of values at pos for each array in array
// simplifyArray([["one",1], ["two",2]], 2);
function simplifyArray(array, pos) {
  let output = [];
  for (let i = 0; i < array.length; i++) {
    output.push(array[i][pos]);
  }

  return output;
}

// return array which contains dom and rec genes
// recDomArray(["Gn","Tst"]);
// return ["GnGn","nGn","TstTst","nTst"];
function recDomArray(array) {
  let output = [];
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] !== "string") {
      break;
    }
    let dom = array[i] + array[i];
    let rec = "n" + array[i];
    output.push(dom);
    output.push(rec);
  }

  return output;
}

// sort array based on another array
// array = ["b", "c", "a", "d"]
// sortOrder = ["a", "b", "c", "d"];
function sort(array, sortOrder) {
  // console.log(array, sortOrder);
  result = array.sort(function (a, b) {
    return sortOrder.indexOf(a) - sortOrder.indexOf(b);
  });
  return result;
}

// NOTE: I think this was for combining arrays (duh) but I can't get it working now xD
function combiner(array) {
  const result = [],
    f = function (prefix = [], array) {
      for (let i = 0; i < array.length; i++) {
        result.push([...prefix, array[i]]);
        f([...prefix, array[i]], array.slice(i + 1));
      }
    };
  f("", array);
  return result;
}

// capitalize every string in array
function capitalizeArr(array) {
  var newArray = [];

  for (var i = 0; i < array.length; i++) {
    if (typeof array[i] !== "string") {
      break;
    }
    newArray.push(array[i].charAt(0).toUpperCase() + array[i].slice(1));
  }
  return newArray;
}

// string.capitalizeStr();
// TODO: capitalize no worky with opening parenthesis even though regexr says it should?
String.prototype.capitalizeStr = function () {
  return this.replace(/(?:^|\(|\s|-|\/)\S/g, function (a) {
    return a.toUpperCase();
  });
};

function camelizeStr(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

// input ID, check element, if value present return value else return false
function getCleaner(id) {
  let output;
  let element = document.getElementById(id);

  // console.log(element.type);

  if (element.type === "select-one") {
    output = element.value !== "false" ? element.value : false;
  } else if (element.type === "text") {
    output = element.value !== "" ? element.value : false;
  } else if (element.type === "checkbox") {
    output = element.checked;
  }

  return output;
}

// count occurences in array
// array.count(query)
// https://stackoverflow.com/questions/6120931/how-to-count-the-number-of-certain-element-in-an-array
Object.defineProperties(Array.prototype, {
  count: {
    value: function (query) {
      var count = 0;
      for (let i = 0; i < this.length; i++) if (this[i] == query) count++;
      return count;
    },
  },
});

// roll a list based on array
// let array = [[50,'string1'],[100,'string2']];
function rngList(array, roll) {
  let output;

  let x = rng(roll);
  for (let i = 0; i < array.length; i++) {
    if (x <= array[i][0]) {
      output = array[i][1];
      break;
    }
  }

  // console.log(output);
  return output;
}

function toggleDisplay(checkbox, toggle) {
  checkbox = document.getElementById(checkbox).checked;
  toggle = document.getElementById(toggle);

  if (checkbox) {
    toggle.style.display = "block";
  }
  if (!checkbox) {
    toggle.style.display = "none";
  }
}

/**
 * @param {string} id
 * @param {array|object} array
 * @param {string} mode - simple, optGroup, geneList, pillSelect
 */
function populate(id, array, mode) {
  // modes:
  // simple ---> array = ['option','option'];
  // optGroup ---> object = {key: ['option','option']}
  // geneList ---> object = {key: [['gene','Gn'],['gene','Gn']]}
  // pillSelect ---> array = ['option','option'];

  if (mode === "simple") {
    let select = document.getElementById(id);
    let options = array;

    for (let i = 0; i < options.length; i++) {
      let opt = options[i];
      let ele = document.createElement("option");
      ele.textContent = opt;
      ele.value = opt;
      select.appendChild(ele);
    }
  }

  if (mode === "optGroup") {
    let select = document.getElementById(id);
    let groups = Object.keys(array);

    for (let i = 0; i < groups.length; i++) {
      let gro = groups[i];
      let groEle = document.createElement("optgroup");
      groEle.label = gro;
      select.appendChild(groEle);

      let options = array[gro];
      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let ele = document.createElement("option");
        ele.textContent = opt;
        ele.value = opt;
        select.appendChild(ele);
      }
    }
  }

  if (mode === "geneList") {
    let select = document.getElementById(id);
    let groups = Object.keys(array);

    for (let i = 0; i < groups.length; i++) {
      let gro = groups[i];
      let groEle = document.createElement("optgroup");
      groEle.label = gro;
      select.appendChild(groEle);

      let options = array[gro];
      for (let i = 0; i < options.length; i++) {
        let opt = options[i][0];
        let ele = document.createElement("option");
        ele.textContent = opt;
        ele.value = opt.replace(/\s/g, "");
        select.appendChild(ele);
      }
    }
  }

  if (mode === "pillSelect") {
    // array = ['test text'...]

    let select = document.getElementById(id);
    let options = array;

    for (let i = 0; i < options.length; i++) {
      // FIXME: wanted to sanitize with .capitalizeStr() and .camelizeStr() but it keeps returning an error for seemingly no reason?
      let text = options[i];

      let ele = document.createElement("SPAN");
      ele.setAttribute("class", "pill");
      ele.setAttribute("id", id + "Opt" + i);
      ele.setAttribute("onclick", "handlePillSelect(this);");
      ele.textContent = text;
      select.appendChild(ele);
      // console.log(ele);
    }
  }
}

// pill inputs
function handlePillSelect(element) {
  // console.log(element.id);
  let ele = document.getElementById(element.id),
    eleClass = ele.classList.contains("pillSelected") === true ? true : false;

  if (eleClass === false) {
    ele.classList.remove("pill");
    ele.classList.add("pillSelected");
  } else if (eleClass === true) {
    ele.classList.remove("pillSelected");
    ele.classList.add("pill");
  }
}

function getPillSelect(parentEle) {
  let classLength = document.querySelectorAll(".pillSelected").length;
  let pills = [];

  for (let i = 0; i < classLength; i++) {
    if (
      document.getElementsByClassName("pillSelected")[i].parentNode.id ===
      parentEle
    ) {
      let value = document.getElementsByClassName("pillSelected")[i].innerText;

      pills.push(value);
    }
  }

  return pills;
}
