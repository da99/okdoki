var _ = require('underscore')
;

var SQL = exports.SQL = function () {
};

SQL.new = function () {
  var sql = Query.new.apply(Query, arguments);
  return sql;
};

function trim(arr) {
  return _.map(arr, function (v) { return v.trim(); });
}

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************


function To_SQL(v, memo) {
  if( _.isString(v) )
    return v;

  if(v.is_join)
    return v.to_sql(memo)[0];

  return Query_To_SQL(v);
}

function Query_To_WHERE(query) {
  var vals = [];
  var l = 0;
  var sql = [];
  var table_name = query.table_name;
  _.each(query.d.where, function (v, i) {
    var sql_sub = add_table_name(table_name, v).replace(/\$[0-9]+/g, function (sub) {
      var num = parseInt( sub.replace('$', '') );
      return '$' + (num + l);
    });
    vals = vals.concat(query.d.vals[i]);
    l = vals.length;
    sql.push( sql_sub );
  });

  return [sql, vals];
}

function Query_To_SQL(sql_query) {
  var sql        = [];
  var vals       = [];
  var data       = sql_query.data();
  var table_name = sql_query.table_name;

  if (data.select.length) {
    sql.push( 'SELECT ' + add_table_name_to_each(table_name || '', data.select)
    .join(', ') );
  }

  if (data.from.length) {
    sql
    .push( 'FROM ' + _.inject(data.from, function (memo, v) {
      return To_SQL(v, memo);
    }, null))
    ;
  }

  if (data.where.length)
    sql.push( "WHERE ");

  var l = 0;
  _.each(data.where, function (v, i) {
    var sql_sub = add_table_name(table_name, v).replace(/\$[0-9]+/g, function (sub) {
      var num = parseInt( sub.replace('$', '') );
      return '$' + (num + l);
    });
    vals = vals.concat(data.vals[i]);
    l = vals.length;
    sql.push( sql_sub );
  });

  sql = sql.join("\n") + ' ;';

  return [sql, vals];
}

function standard_var_names(wheres, vals) {
  _.each(wheres, function (raw_sql, i) {
    s_vals = s_vals.concat(vals[i]);

    s_where[i] = raw_sql.replace(/\$[0-9]+/g, function (sub, pos, full_string) {
      var orig_num = parseInt(sub.replace('$', ''));
      var new_num  = orig_num + length;
      return '$' + new_num;
    });

    length = s_vals.length;
  });
}

function add_table_name(name, v) {
  name = name.trim();
  v = v.trim();
  if (v.indexOf('.') === 0)
    v = name + v;
  return v;
}

function add_table_name_to_each(name, arr) {
  return _.map(arr, function (v) {
    return add_table_name(name, v);
  });
}

// ****************************************************************
// ****************** Query ***************************************
// ****************************************************************

var Query = function (parent) {
  this.parent = parent;
  this.table_name = (parent && parent.table_name) || null;
  this.d = {};
  this.d.select = [];
  this.d.from   = [];
  this.d.where  = [];
  this.d.vals   = [];
  this.d.join   = [];
  this.is_query = true;
};

Query.new = function (parent) {
  var t = new Query(parent);
  return t;
};

Query.prototype.select = function () {
  this.d.select = this.d.select.concat(_.toArray(arguments));

  return this;
};

Query.prototype.from = function (o) {
  this.d.from.push(o);
  if (!this.table_name && _.isString(o))
    this.table_name = o;
  return this;
};

Query.prototype.where = function (sql, vals) {
  this.d.where.push(sql);
  this.d.vals.push(vals || []);

  return this;
};

Query.prototype.and = function (sql, vals) {
  this.where(' AND ' + sql, vals);

  return this;
};

Query.prototype.or = function (sql, vals) {
  this.where(' OR ' + sql, vals);

  return this;
};

_.each('left right inner'.split(' '), function (name) {
  name = name || 'inner';
  Query.prototype[name + '_join'] = function (sql) {
    var lj = Join.new(name, sql, this);
    this.d.from.push(lj);
    return this;
  };
});

_.each('as on'.split(' '), function (name) {
  Query.prototype[name] = function () {
    var j = _.last(this.d.from);
    j[name].apply(j, arguments);
    return this;
  };
});

Query.prototype.data = function () {
  var data = _.clone(this.d);
  if (!this.parent)
    return data;

  // Merge two datas together:
  var p_data = this.parent.data();
  _.each(p_data, function (v, key) {
    if (_.isArray(v)) {
      data[key] = p_data[key].concat(data[key]);

      if (key === 'where' && p_data['where'].length > 0 && data['where'].length > 0) {
        data[key][p_data['where'].length] = ' AND ' + data[key][p_data['where'].length];
      }
      return;
    }

    if (_.isObject(v)) {
      data[key] = _.extend(p_data[key], data[key]);
      return;
    }

    return;

  });

  return data;
};

Query.prototype.to_sql = function () {
  return Query_To_SQL(this);
};

// ****************************************************************
// ****************** Join ****************************************
// ****************************************************************

var Join = function (dir, sql) {
  this.d          = {};
  this.d.dir      = dir.toUpperCase();
  this.d.sql      = sql;
  this.d.on       = [];
  this.d.vals     = [];
  this.table_name = sql.table_name || sql;
  this.is_join    = true;
};

Join.new = function (dir, sql, parent) {
  var j = new Join(dir, sql, parent);
  return j;
};

Join.prototype.on = function (left, right, vals) {
  this.d.on.push( [left, right] );
  if( vals )
    this.d.vals.push(vals);
  return this;
};

Join.prototype.as = function (name) {
  this.table_name = name;
  return this;
};

Join.prototype.to_sql = function (name) {
  var me = this;

  var sql = "( " + name + ' ' + this.d.dir + ' JOIN ' + me.table_name + ' ON ';

  var ons = [];
  _.each(this.d.on, function (pair, i) {
    ons.push(add_table_name(name, pair[0]) + ' = ' + add_table_name(me.table_name, pair[1]));
  });

  if (me.d.sql) {
    if (me.d.sql.is_query)
      ons = ons.concat(Query_To_WHERE(me.d.sql)[0]);
  }

  sql += ons.join(' AND ') +  ' )';
  return [sql, this.d.vals];
};











































