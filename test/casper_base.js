function exists( s ) {
  return function () {
    return this.exists(s);
  };
};

function test() {
  var type = arguments[0];
  var args = [];
  var l = arguments.length;
  var i = 1;
  while (i < l) {
    args.push(arguments[i]);
    i++;
  };
  return function () {
    this.test[type].apply(this.test, args);
  };
};

exports.create_exists = exists;
exports.create_test   = test;


