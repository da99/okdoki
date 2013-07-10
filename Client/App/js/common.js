

var COMMON_NS = {
  ALL_WHITE_SPACE : /\s+/g,
  BEGIN_AT_OR_HASH : /^(@|#)/
};

function canonize_screen_name (str) {
  if (!str)
    return str;

  if (str.trim)
    str = str.trim();
  else
    str = $.trim(str);

  return str.toUpperCase().replace(COMMON_NS.BEGIN_AT_OR_HASH, '').replace(COMMON_NS.ALL_WHITE_SPACE, '-');

}


if (typeof exports !== 'undefined') {
  exports.canonize_screen_name = canonize_screen_name;
}
