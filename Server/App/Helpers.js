var _ = require('underscore')._;

var S = /\s+/g;

exports.H = {
  preview : function (raw_str) {
    var str = raw_str.trim();
    if (!str)
      return '...';
    if (str.length < 20)
      return str;
    var pieces = str.split(S);
    if (pieces.length < 13)
      return str;
    return pieces.slice(0, 10).join(' ') + '...';
  }
};
