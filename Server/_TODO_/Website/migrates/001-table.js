
var table = 'Website';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE \"' + table + "\" ( \n\
id             serial PRIMARY KEY, \
type_id        smallint NOT NULL,  \
owner_id       int NOT NULL,       \
title          text default null,  \
about          text default null,  \
$created_at    ,          \
$trashed_at               \
);";
    r.create(sql);

  }
};
