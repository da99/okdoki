
// ================================================================

function log_length(se, orig) {
  var e = $(se);
  if (!e.length)
    log('None found for: ', (orig || se));
  return e;
}

function show(se) {
  return log_length(se).show();
}

function hide(se) {
  return log_length(se).hide();
}
