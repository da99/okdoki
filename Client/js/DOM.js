
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


// ============================================
// Note:
// Selector for .draw_or_update
//   must be in the form of: TAG.class
// ============================================
function after(se) {
  var e = $(se);
  var parent = e.parent();

  var meths = {
    draw_or_update : function (se, txt) {
      var pieces = se.split('.');
      var tag = pieces[0];
      var css = pieces[1];
      var new_e = $('<' + tag + '></' + tag + '>' );
      if(css)
        new_e.addClass(css);
      new_e.text(txt);
      log('drawing:', se, txt);

      // Remove previous. if any:
      parent.find(se).remove();
      e.after(new_e);

      return new_e;
    }
  };

  if (!e.length) {
    log('Not found: ', se);
    _.each(meths, function (v, k) {
      meths[k] = do_nothing;
    });
  }

  return meths;
}


function add_okdoki_link(str) {
  throw new Error('This funcition is obsolete/unsafe.');
  return _.map(str.split(/\!(okdoki|br)/g), function (p, i) {
    if (p==='okdoki') {
      var e = $('<a></a>');
      e.text('okdoki.com');
      e.attr('href', '/');
    } else if (p === 'br') {
      var e = $('<br />');
    } else {
      var e = $('<span></span>');
      e.text(p);
    };
    return e
  });
}
