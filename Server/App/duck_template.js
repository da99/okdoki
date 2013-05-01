

var table = "";
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE TABLE IF NOT EXISTS ' + table + " ( \
\
    );";
    r.create(sql);

  }
};
