var request = require('request');
var _ = require('underscore')._;

request('http://localhost:5000/', function (e1, r1,  b1) {
  console.log(r1.request.headers);
  // console.log(r1.headers);
  request('http://localhost:5000', function (e, r, b) {
    // console.log(_.keys(r.request));
    console.log(r.request.headers);
    request('http://localhost:5000', function (e3, r3, b3) {
      // console.log(_.keys(r.request));
      console.log(r3.request.headers);
    });
  });
})
