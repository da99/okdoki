"use strict";

var ALL_WHITE_SPACE  = /\s+/g;


// =======================================================================================

var do_nothing = function() {};

function func() {
  return _.partial.apply(_, arguments);
}

