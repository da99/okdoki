
var table = 'Uni';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE \"' + table + "\" ( \n\
id             serial PRIMARY KEY, \
owner_id       int,                \
title          text default null,  \
about          text default null,  \
folder_seq     smallint DEFAULT 0 NOT NULL,   \
$created_at    ,          \
$trashed_at               \
);";
    r.create(sql);

  }
};
