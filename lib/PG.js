var log = require('okdoki/lib/base').log;
var PG        = null;
var SQL       = require('okdoki/lib/SQL').SQL;
var _         = require('underscore');
var pg        = require('pg');
var uri       = require('uri-js');
var pg_client = function (db) {

  var db_url = process.env.DATABASE_URL;

  if (db) {
    var pieces = uri.parse(process.env.DATABASE_URL);
    pieces.path = db;
    db_url = uri.serialize(pieces);
  }

  var c = new pg.Client(db_url);
  c.connect();

  return c;
};


exports.PG = PG = function () {
};

PG.new = function (name, river_job) {
  this.name      = name;
  this.river_job = river_job;
  this.sql       = null;
  this.querys    = [];
};

_.each('select delete'.split(' '), function (name) {
  PG.prototype[name] = function () {
    this.sql = SQL.new();
    this.sql[name].apply(this.sql, arguments);
    this.querys.push(this.sql);
    return this;
  };
});

_.each("from where limit".split(' '), function (name) {
  PG.prototype[name] = function () {
    this.sql[name].apply(this.sql, arguments);
    return this;
  };
});

PG.prototype.error = function (msg) {
  if (this.job) {
    this.job.river.error(msg);
  else
    throw new Error(msg);
  }
};

PG.prototype.run = function () {
  _.each(this.querys, function (sql) {
    sql.to_sql();
  });
};





