
function canonize_screen_name (str) {
  if (!str)
    return str;

  if (str.trim)
    str = str.trim();
  else
    str = $.trim(str);

  return str.toUpperCase().replace(BEGIN_AT_OR_HASH, '').replace(ALL_WHITE_SPACE, '-');

}

