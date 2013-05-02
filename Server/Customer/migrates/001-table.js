
var table = 'Customer';
module.exports = {};
module.exports.migrate = function (dir, r) {
  if (dir === 'down') {
    r.drop(table);
  } else {
    var sql = ' \
    CREATE TABLE IF NOT EXISTS "' + table + '" (                \n\
    id           serial primary key,                            \n\
    email        text,                                          \n\
    pass_phrase_hash varchar(150) NOT NULL,                     \n\
    created_at          $now_tz,                 \n\
    trashed_at          $null_tz                 \n\
    )';
    r.create(sql);
  }
};
