// var getJSON = function(url, callback) {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', url, true);
//   xhr.responseType = 'json';
//   xhr.onload = function() {
//     var status = xhr.status;
//     if (status === 200) {
//       callback(null, xhr.response);
//     } else {
//       callback(status, xhr.response);
//     }
//   };
//   xhr.send();
// };

// getJSON('https://spreadsheets.google.com/feeds/cells/1b-KFBewCtFjyQZT0Aum2tWLrMICEGLGvtmmU4f7IV9Q/od6/public/basic?alt=json',
// function(err, data) {
//   console.log(data);
// });