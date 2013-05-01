var Topogo = require("topogo").Topogo;

var table = '"Customer"';
module.exports = {};
module.exports.migrate = function (dir, r) {
  if (dir === 'down') {
    Topogo.run("DROP TABLE IF EXISTS " + table + ";", [], r);
  } else {
    var sql = " \
    CREATE TABLE IF NOT EXISTS " + table + " (          \
    id serial primary key,                          \
    trashed_at bigint default null,                 \
    email text,                                     \
    pass_phrase_hash varchar(150) NOT NULL          \
    )";
    Topogo.run(sql, [], r);
  }
};
