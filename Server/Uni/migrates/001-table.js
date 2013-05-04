
var table = 'Uni';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE \"' + table + "\" ( \n\
id        serial PRIMARY KEY, \
owner_id  int,                \
title     text default null,  \
about     text default null,  \
created_at $now_tz,           \
trashed_at $null_tz           \
);";
    r.create(sql);

  }
};
