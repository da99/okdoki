
var table = 'Contact';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    r.create('CREATE TABLE IF NOT EXISTS "@T" (                      \n\
             id            serial PRIMARY KEY,                       \n\
             "from_id"     int DEFAULT NULL,                         \n\
             "to_id"       int DEFAULT NULL,                         \n\
             trashed_at    $null_tz,                                 \n\
             CONSTRAINT    "@T_from_id" UNIQUE ("from_id", "to_id")  \n\
             );'.replace('@T', table));

  }
};
