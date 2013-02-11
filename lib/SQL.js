var _ = require('underscore')
;

var SQL = exports.SQL = function () {
  this.type = null;
  this.data = {select: [], from: [], where: [], vals: []};
  this.is_sql = true;
};

SQL.new = function (args) {
  var sql = new SQL();
  return sql;
};

SQL.prototype.select = function () {
  this.type   = 'select';
  this.data.select = this.data.select.concat(_.toArray(arguments));
  return this;
};

_.each("limit".split(' '), function (name) {
  SQL.prototype[name] = function () {
    this.data[name] = _.toArray(arguments);
    return this;
  };
});

SQL.prototype.from = function (str_or_sql) {
  this.data.from.push(str_or_sql);
  return this;
};

SQL.prototype.where = function (raw_sql, vals) {
  var me = this;
  this.data.where.push(raw_sql);
  this.data.vals.push(vals || []);
  return this;
};

SQL.prototype.and = function (sql, vals) {
  this.where(' AND ' + sql, vals);
  return this;
};

SQL.prototype.to_sql = function () {
  return SQL['to_' + this.type + '_sql'](this);
};

SQL.extract_data = function (o, skip_s_vals) {
  var select = [];
  var where  = [];
  var vals   = [];
  var from   = [];
  var s_where = [];
  var s_vals  = [];

  _.each(o.data.from, function (t, i) {
    if (_.isString(t)) {
      from.push(t);
    } else {
      var data = SQL.extract_data(t, true);
      if (where.length > 0 && data.where.length > 0)
        data.where[0] = ' AND ' + data.where[0];
      where = where.concat(data.where);
      vals  = vals.concat(data.vals);
      from  = from.concat(data.from);
    };
  });

  select = select.concat(o.data.select);
  vals   = vals.concat(o.data.vals);

  var pos = where.length;
  where = where.concat(o.data.where);
  if (pos > 0)
    where[pos] = ' AND ' + where[pos];


if (!skip_s_vals) {
  var length = 0;
  _.each(where, function (raw_sql, i) {
    s_vals = s_vals.concat(vals[i]);

    s_where[i] = raw_sql.replace(/\$[0-9]+/g, function (sub, pos, full_string) {
      var orig_num = parseInt(sub.replace('$', ''));
      var new_num  = orig_num + length;
      return '$' + new_num;
    });

    length = s_vals.length;
  });
}

  return {
    select: select,
    where: where,
    vals: vals,
    from: from,
    s_where : s_where,
    s_vals  : s_vals
  };
};

SQL.to_select_sql = function (o) {
  var d = SQL.extract_data(o);

  var sql = null;
  sql = ["SELECT",
    d.select.join(', '),
  ]

  sql.push('FROM');
  sql.push(d.from.join(' INNER JOIN '));

  if (d.s_where.length > 0) {
    sql = sql.concat(['WHERE'].concat(d.s_where));
  }
  sql = sql.join(" \n") + ' ;';

  return [sql, d.s_vals];
};
