
var path = require('path');
var Cache_Names = {};
var ALL_SLASH = /\//ig;

function canon_name(str) {
  return path.resolve( 'Server/Blade/Client_' + str.replace(ALL_SLASH, "_") + '.blade.js');
}

function Get_Render_Func(raw_str) {
  var name = canon_name(raw_str);
  var mod  = Cache_Names[name];
  if (!mod)
    mod = Cache_Names[name] = require(name);
  return mod;
}

function render(raw_name, locals, func) {
  Get_Render_Func(raw_name).render(locals, func);
}


exports.render = render;
exports.__express = render;
