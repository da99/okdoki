var  _  = require('underscore')
, pg    = require('pg')
, uri   = require('uri-js')
, log   = require('okdoki/lib/base').log
, SQL   = require('okdoki/lib/SQL').SQL
, River = require('okdoki/lib/River').River
;

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************
//

var double_slashs = /\/\//g;
var mb            = function (num) { return num * 1024 * 1024; };
var now           = function () { return (new Date).getTime(); };




// ****************************************************************
// ****************** Configs *************************************
// ****************************************************************


var T = exports.Topogo = function () {};
River.topogo = T;

T.id_size = 26;

T.sql = {
  select_default_owner : "\
    SELECT usename AS owner            \
    FROM pg_database, pg_user          \
    WHERE datname = current_database() \
      AND datdba = usesysid;           \
  ",

  select_databases : "\
    SELECT datname AS name            \
    FROM pg_database                  \
    WHERE datistemplate = false       \
        AND datname LIKE 'custom%';   \
  ",

  // FROM: http://stackoverflow.com/questions/769683/show-tables-in-postgresql
  select_tables : "SELECT table_schema || '.' || table_name AS name  \
    FROM    information_schema.tables                                \
    WHERE   table_type = 'BASE TABLE'                                \
    AND     table_schema NOT IN ('pg_catalog', 'information_schema') \
  "
};

// ****************************************************************
// ****************** Main Stuff **********************************
// ****************************************************************

T.new = function (name, db) {
  var t   = new T;
  t.table = name;
  t.name  = name;
  t.db    = db;

  var db_url = process.env.DATABASE_URL;

  if (db) {
    var pieces = uri.parse(process.env.DATABASE_URL);
    pieces.path = db;
    db_url = uri.serialize(pieces);
  }

  t.db_url = db_url;
  return t;
};

T.query = function(t, flow, f) {
  var name = 'topogo client';
  var client = flow.origin().get(name);
  if (client) {
    f(client);
  } else {
    client = new pg.Client(t.db_url);
    client.connect(function (err) {
      if (err)
        flow.error(err);
      else {
        flow.origin().set(name, client);
        f(client);
      }
    });
  }
};

T.run = function (topogo, q, vars, flow) {

  var me = topogo;
  T.query(me, flow, function (client) {

    client.query(q, vars, function (err, result) {

      if (err) {

        if (err.detail) {
          if (err.detail.indexOf("Key (" + name + ")=") > -1 &&
              err.detail.indexOf(") already exists") > 0)
            return flow.dup(name);

          if (err.detail.indexOf("duplicate key value violates unique constrait") > -1 &&
              err.detail.indexOf("_" + name + '_') > 33)
            return flow.dup(name);
        }

        if (process.env.IS_TESTING || process.env.IS_DEV)
          console['log'](q);

        flow.error(err);
      }

      flow.finish(result);
    });
  });
};

T.prototype.toString = function () {
  return "Topogo (instance, table: " + this.table + ")";
};

T.prototype.delete_trashed = function (flow) {
  var sql = "\
    DELETE FROM " + table_name + "   \
    WHERE trashed_at IS NOT NULL AND \
        (extract(epoch from ( timezone('UTC'::text, now()) - trashed_at)) / 60 / 60) > 48 \
    RETURNING * ;                    \
  ";

  this.run(sql, [], flow.concat(function (result) {
    flow.finish(result.rows);
  }));
  return this;
};

T.show_tables = function () {
  var sql  = T.sql.select_tables
  , on_fin = null
  , flow   = null;

  _.each(arguments, function (v) {
    if (_.isString(v))
      sql += ' ' + v;
    else if (_.isFunction(v))
      on_fin = v;
    else
      flow = v;
  });

  var db = T.run(T.new('no table'), sql, [], {
    error: function (result) {
      if (flow)
        flow.error(result);
      else
        throw new Error(result);
    },

    finish: function (rows) {
      var tables = _.pluck(rows.rows, 'name');
      if (on_fin)
        return on_fin(tables);
      if (flow)
        return flow.finish(tables);
  }});

  return db;
};



// ****************************************************************
// ****************** CREATE **************************************
// ****************************************************************

T.prototype.create = function (data, flow) {
  var me = this;

  var cols = [], vals = [], places = [], i = 0;
  _.each(data, function (v, col) {
    cols.push(col);
    vals.push(v);
    ++i;
    places.push('$' + i);
  });

  var sql = "\
    INSERT INTO @table (@cols)   \
    VALUES (@vals)               \
    RETURNING * ;                \
  "
  .replace('@table', me.table)
  .replace('@cols', cols.join(', '))
  .replace('@vals', places.join(', '));

  T.run(me, sql, vals, flow.concat(function (result) {
    flow.finish(result.rows[0]);
  }));
};

T.prototype.create_index = function (data, flow) {
  var name = this.name;
  request.post({
    url  : T.url('/index?collection=' + name),
    json : true,
    body : data
  }, on_complete(flow));
};

T.prototype.create_collection = function (flow) {
  var name = this.name;
  request.post({
    url: T.url('/collection'),
    json: true,
    body: {
      name: name,
      waitForSync: true,
      journalSize: T.mb(4)
    }
  }, on_complete(flow));
};


// ****************************************************************
// ****************** READ ****************************************
// ****************************************************************

T.read_list = function (flow) {
  request.get({
    url: T.url("/collection"),
    json: true
  }, on_complete(flow));
};

T.prototype.read = function (id, flow) {
  var name = this.name;

  request.get({
    url: T.url("/document/" + name + '/' + id),
    json: true
  }, on_complete(flow));
};

function doc_to_set(doc, val_arr) {
  var arr = doc_to_equals(doc, val_arr);
  return arr.join(', ');
}

function doc_to_and(doc, val_arr) {
  var arr = doc_to_equals(doc, val_arr);
  return arr.join(' AND ');
}

function doc_to_equals(doc, val_arr) {
  var i = val_arr.length;
  var sql_vals = [];
  _.each(doc, function (v, k) {
    ++i;
    sql_vals.push( k + " = $" + i )
    val_arr.push(v);
  });

  return sql_vals;
}

T.prototype.read_by_id = function (id, flow) {
  return this.read_one_by_example({id: id}, flow);
};

T.prototype.read_one_by_example = function (doc, flow) {
  var me = this;
  me.read_by_example(doc, flow.concat(function (results) {
    flow.finish(results[0]);
  }));
};

T.prototype.read_by_example = function (doc, flow) {
  var me   = this;
  var vals = [];
  var sql  = "SELECT * FROM @table WHERE @vals ;"
  .replace('@table', me.table)
  .replace('@vals', doc_to_and(doc, vals));

  T.run(me, sql, vals, flow.concat(function (results) {
    flow.finish(results.rows);
  }));
};

T.prototype.read_list_all_ids = function (flow) {
  var me = this;
  request.get({
    url: T.url("/document?collection=" + me.name),
    json: true
  }, on_complete(flow, function (data) {
      flow.finish(data.documents);
  }))
};

T.prototype.read_list_indexs = function (flow) {
  var me = this;
  request.get({
    url: T.url('/index?collection=' + me.name),
    json: true,
  }, on_complete(flow));
};

T.prototype.read_list = function (q, vars, flow) {
  var me = this;
  request.post({
    url: T.url("/cursor/"),
    json: true,
    body: {query: q, bindVars: vars}
  }, on_complete(flow, function (data) {
    flow.finish(data.result);
  }));
};

// ****************************************************************
// ****************** UPDATE **************************************
// ****************************************************************

T.prototype.update = function (id, data, flow) {
  var me = this;
  var vals = [id];
  var sql = " UPDATE @table SET @vals WHERE id = $1 RETURNING * ;"
  .replace('@table', me.table)
  .replace('@vals', doc_to_set(data, vals));

  T.run(me, sql, vals, flow.concat(function (result) {
    flow.finish(result.rows[0]);
  }));
};

// ****************************************************************
// ****************** Trash/Untrash********************************
// ****************************************************************

T.prototype.untrash = function (id, flow) {
  var me = this;
  River.new(arguments)
  .job('update', function (j) {
    me.update(id, {trashed_at: null}, j);
  })
  .run();
};

T.prototype.trash = function (id, flow) {
  var me = this;
  var _now = now();
  River.new(arguments)
  .job('update', function (j) {
    me.update(id, {trashed_at: _now}, j);
  })
  .reply(function () {
    return _now;
  })
  .run();
};

// ****************************************************************
// ****************** DELETE **************************************
// ****************************************************************


T.prototype.del = function (id, flow) {
  var me = this;
  request.del({
    url: T.url("/document/" + me.name + '/' + id),
    json: true
  }, on_complete(flow, 'delete'));
};

T.prototype.del_list = function (q, vars, flow) {
  var me = this;
  var i = 0;
  var vals = [];
  _.each(vars, function (v, name) {
    ++i;
    q = q.replace('@' + name, '$' + i);
    vals.push(v);
  });

  var sql = "DELETE FROM " + me.table + " WHERE " + q + " RETURNING * ; ";
  T.run(me, sql, vals, flow);
};

T.prototype.delete_all = function (flow) {
  var me = this;
  var err = function () { return flow.error.apply(flow, arguments); };
  me.read_list_all_ids({
    error: err,
    finish: function (docs) {
      var ids = [];
      if (!docs.length)
        flow.finish(docs);
      _.each(docs, function (path) {
        ids.push(path.split('/').pop());
        me.del(ids[ids.length - 1], {
          error: err,
          finish : function (data) {
            docs.pop();
            if (!docs.length)
              flow.finish(ids);
          }
        });
      });
    }
  });
};

T.prototype.drop = function (flow) {
  var me = this;
  return T.run(me, "DROP TABLE " + me.table + '; ', [], flow);
};

T.prototype.delete_collection = function (flow) {
  var name = this.name;

  request.del({
    url: T.url('/collection/' + name),
    json: true
  }, on_complete(flow, 'delete'));

  return true;
};


// ****************************************************************
// ****************** OLD CODE ************************************
// ****************************************************************


T.rollback = function rollback(client, on_err) {
  return function (err, meta) {
    if (err) {
      client.query('ROLLBACK', [], function (new_err) {
        client.end();
        if (on_err)
          on_err(new_err || err);
        else
          throw (new_err || err);
      });
    };

  };
};















