
var table = 'Customer';
module.exports = {};
module.exports.migrate = function (dir, r) {
  if (dir === 'down') {
    r.drop(table);
  } else {
    var sql = ' \
    CREATE TABLE IF NOT EXISTS "' + table + '" (          \
    id serial primary key,                          \
    trashed_at bigint default null,                 \
    email text,                                     \
    pass_phrase_hash varchar(150) NOT NULL          \
    )';
    r.create(sql);
  }
};
