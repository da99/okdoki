var _ = require('underscore')
;

var SQL = exports.SQL = function () {
  this.type = null;
  this.data = {where: [], vals: []};
};

SQL.new = function (args) {
  var sql = new SQL();
  return sql;
};

SQL.prototype.select = function () {
  this.type   = 'select';
  this.data.select = _.toArray(arguments);
  return this;
};

_.each("limit".split(' '), function (name) {
  SQL.prototype[name] = function () {
    this.data[name] = _.toArray(arguments);
    return this;
  };
});

SQL.prototype.from = function (name) {
  this.data.from = name;
  return this;
};

SQL.prototype.where = function (sql, val) {
  this.data.where.push(sql);
  this.data.vals.push(val);
  return this;
};

SQL.prototype.and = function (sql, val) {
  this.data.where.push([' AND ' + sql, val]);
  return this;
};

SQL.prototype.to_sql = function () {
  return SQL['to_' + this.type + '_sql'](this);
};

SQL.to_select_sql = function (o) {
  var sql = null;
  sql = ["SELECT",
    o.data.select.join(', '),
    "FROM",
    o.data.from
  ]

  if (o.data.where.length > 0) {
    sql = sql.concat(['WHERE'].concat(o.data.where));
  }
  sql = sql.join(" \n");

  return [sql, o.data.vals];
};
