var Topogo = require("topogo").Topogo;

module.exports = {};
module.exports.migrate = function (dir, r) {
  if (dir === 'down') {
    Topogo.run("DROP TABLE IF EXISTS customers;", [], r);
  } else {
    var sql = " \
    CREATE TABLE IF NOT EXISTS customers (          \
    id serial primary key,                          \
    trashed_at bigint default null,                 \
    email text,                                     \
    pass_phrase_hash varchar(150) NOT NULL          \
    )";
    Topogo.run(sql, [], r);
  }
};
