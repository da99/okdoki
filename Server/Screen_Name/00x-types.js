

var table = "Screen_Name_Type";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE \"" + table + "\" (   \n\
    id           serial PRIMARY KEY, \n\
    name         char(255) NOT NULL, \n\
    about        char(255),          \n\
    $created_at  ,                   \n\
    $updated_at                      \n\
    );";

    var river = River.new(r)
    .job(function (j) {
      r.PG.run(sql, [], j);
    });

    _.each([
      ['Human', 'People, living celebrity humans/animals.'],
      ['Pet', 'Actual pet animals of humans.'],
      ['Impersonation', 'Fictional characters, historical figures, etc.'],
      ['Biz', 'Small/Med/Big For-Profit Business.'],
      ['Academic', 'Schooling and indoctrination institutions.'],
      ['Government/State', 'Organizations that have a monopoly on violence and weapons.'],
      ['Charity', 'Non-profit orgs.']
    ], function (pair) {
      river.job(function (j) {
        r.PG.run("INSERT INTO \"" + table + "\" (name, about) VALUES ($1, $2);", pair, j);
      })
    });

    river.run();
  }
};
