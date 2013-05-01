
var Topogo = require("topogo").Topogo;
var River  = require("da_river").River;

var table = '"Home_Page"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    Topogo.run('DROP TABLE IF EXISTS ' + table +  ';', [], r);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \n" +
"owner_id  int PRIMARY KEY,    \
title      text default null,  \
about      text default null" +
');';
    Topogo.run(sql, [], r);

  }
};
