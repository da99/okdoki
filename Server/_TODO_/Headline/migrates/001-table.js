

var table = "Headline";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS "@T" (                \n\
    id             serial PRIMARY KEY,                          \n\
    author         varchar(50) NOT NULL,                        \n\
    body           text NOT NULL,                               \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );'.replace(/@T/g, table);
    r.create(sql);

  }
};
