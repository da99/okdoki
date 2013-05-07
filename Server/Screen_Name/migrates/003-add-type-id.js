

var table = "Screen_Name_Type";
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.finish();

  } else {

    var sql = "ALTER TABLE \"Screen_Name\" \n\
      ADD COLUMN type_id smallint DEFAULT 1 NOT NULL  \n\
    ;";
    r.create(sql);

  }
};
