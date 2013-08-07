
var DOT = require('diet-dot');

var path = require('path');
var Cache_Names = {};
var ALL_SLASH = /\//ig;
var E = require('escape_escape_escape').Sanitize.html;

function canon_name(str) {
  return path.resolve( 'Server/HTML_Templates/Client_' + str.replace(ALL_SLASH, "_") + '.js');
}

function Get_Render_Func(raw_str) {
  var name = canon_name(raw_str);
  var mod  = Cache_Names[name];
  if (!mod)
    mod = Cache_Names[name] = require(name);
  return mod;
}

function render(raw_name, locals) {
  console.log(locals)
  return Get_Render_Func(raw_name).render(E(locals));
}

exports.render = render;


// var path = require('path');
// var Cache_Names = {};
// var ALL_SLASH = /\//ig;

// function canon_name(str) {
  // return path.resolve( 'Server/Blade/Client_' + str.replace(ALL_SLASH, "_") + '.blade.js');
// }

// function Get_Render_Func(raw_str) {
  // var name = canon_name(raw_str);
  // var mod  = Cache_Names[name];
  // if (!mod)
    // mod = Cache_Names[name] = require(name);
  // return mod;
// }

// function render(raw_name, locals, func) {
  // Get_Render_Func(raw_name).render(locals, func);
// }


// exports.render = render;
// exports.__express = render;
