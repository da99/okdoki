
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


function on_click_if_any(se, func) {
  if ($(se).length)
    return on_click(se, func);
  return;
}

function on_click(selector, func) {
  var e = $(selector);
  if (!e.length) {
    log("None found for: ", selector.selector || selector);
  }

  e.click(function (ev) {
    ev.stopPropagation();
    ev.preventDefault();

    func.apply(this, arguments);
    return false;
  });

  return e;
}

function swap_display(show, hide) {
  var s = $(show);
  var h = $(hide);
  if (s.is(':visible')) {
    s.hide();
    h.show();
  } else {
    s.show();
    h.hide();
  };
}

function toggles(show, hide) {
  var target = $($(show).attr('href'));
  var origin = $(show).parents('div.show');
  on_click(show, function (e) {
    target.show();
    origin.hide();
    return false;
  });

  on_click(hide, function (e) {
    target.hide();
    origin.show();
    return false;
  });
}

