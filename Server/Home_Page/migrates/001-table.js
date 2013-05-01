
var table = '"Home_Page"';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \n" +
"owner_id  int PRIMARY KEY,    \
title      text default null,  \
about      text default null" +
');';
    r.create(sql);

  }
};
