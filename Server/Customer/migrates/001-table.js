
var table = 'Customer';
module.exports = {};
module.exports.migrate = function (dir, r) {
  if (dir === 'down') {
    r.drop(table);
  } else {
    var sql = ' \
    CREATE TABLE IF NOT EXISTS "' + table + '" (                \n\
    id               serial primary key,                        \n\
    email            text,                                      \n\
    pass_phrase_hash char(100) NOT NULL,                        \n\
    log_in_at        date NOT NULL DEFAULT current_date,       \n\
    log_in_count     smallint DEFAULT 0 NOT NULL,               \n\
    $created_at,                                                \n\
    $trashed_at                                                 \n\
    )';
    r.create(sql);
  }
};
