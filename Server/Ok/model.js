var _ = require('underscore')._
;

exports.__model_list = [];
exports.__replace_table = null;

exports.SQL = function (sql) {
  var k = exports.__model_list;
  ;
  if (!exports.__replace_table) {
    exports.__replace_table = new RegExp('@(' + k.join('|') + ')','ig')
  }
  var reg_ex = exports.__replace_table;
  return sql.replace(reg_ex, function (full, name) {
    return '"' + (exports.Model[name].TABLE_NAME || s) + '"';
  });
};

exports.Model = {
  -new- : function (m) {
    if (arguments.length === 2) {
      var exp  = arguments[0];
      var name = arguments[1];
      if (exp[name])
        throw new Error(name + " already defined.");
      exports.Model[name] = exp[name] = exports.Model.new(function () {});;
      exports.__model_list.push(name);
      exports.__replace_table = null;
      return exp[name];
    }

    if (m.new) {
      throw new Error(".new already defined.");
    }

    m.new = function (data) {
      if (arguments.length === 1 && !data)
        return null;

      var o = new m;

      if (data) {
        if (_.isArray(data)) {
          return _.map(data, function (v) {
            return m.new(v);
          });
        }

        o.data = data;
      }

      if (m.prototype._new)
        o._new();
      o.is_ok_model = true;

      return o;
    };

    m.prototype.update = function () {
      if (!this.is_update_able())
        return _.last(arguments).finish();
      return this._update.apply(this, arguments);
    };

    m.prototype.get_data = exports.Model.get_data;
    m.public_data        = exports.Model.public_data;

    var pd = m.public_data();

    return m;
  },

  public_data: function (arr) {
    var model = this;
    return _.map(arr, function (o) {
      if (o.is_ok_model) {
        var pd = o._public_data();

        Object.defineProperty(pd, "model", {
          enumerable: false,
          value     : o
        });

        Object.defineProperty(pd, "is_public_data", {
          enumerable: false,
          value     : true
        });
      }
      return this.new(o).public_data();
    });
  },

  get_data: function (args) {
    var me   = this;
    var args = _.flatten(_.toArray(arguments));
    var data = {};

    _.each(args, function (k) {
      data[k] = me.data[k];
    });

    return data;
  }

};
