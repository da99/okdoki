

var table = "Folder";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE "@T" (                              \n\
    id                  serial PRIMARY KEY,                     \n\
    num                 smallint DEFAULT 0 NOT NULL,            \n\
    website_id          $id_type,                               \n\
    $owner_id           ,                                       \n\
    title               varchar(123),                           \n\
    $created_at         ,                                       \n\
    $trashed_at         ,                                       \n\
    CONSTRAINT          "@T_num"    UNIQUE (website_id, num)    \n\
    CONSTRAINT          "@T_title"  UNIQUE (website_id, title)  \n\
    );'.replace('@T', table);
    r.create(sql);

  }
};
