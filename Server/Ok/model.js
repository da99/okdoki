var _ = require('underscore')._
;

var Model = {
  map           : {},
  map_keys      : [],
  replace_table : null,

  instance_update : function () {
    if (!this.is_update_able())
      return _.last(arguments).finish();
    return this._update.apply(this, arguments);
  },

  instance_get_data: function (args) {
    var me   = this;
    var args = _.flatten(_.toArray(arguments));
    var data = {};

    _.each(args, function (k) {
      data[k] = me.data[k];
    });

    return data;
  },

  class_to_client_side: function (raw_arr) {
    var arr = _.flatten(_.toArray(arguments));
    var me  = this;

    var objs =  _.map(arr, function (o) {
      var data  = (o.is_ok_model) ? o.to_client_side() : o;
      var model = (o.is_ok_model) ? o : me.new(data);

      Object.defineProperty(data, "model", {
        enumerable : false,
        value      : model
      });

      Object.defineProperty(data, "is_client_side", {
        enumerable: false,
        value     : true
      });

      return data;
    });

    if (arr.length === 1 && !_.isArray(raw_arr) )
      return objs[0];
    return objs;
  },

  new_instance  : function (data) {
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
  },

  "new"     : function (exp, name) {
    if (exp[name])
      throw new Error(name + " already defined.");
    if (Model.map[name])
      throw new Error(name + " already an Ok Model.");

    var m = Model.map[name] = exp[name] = function () {};
    Model.replace_table = null;
    Model.map_keys.push(name);

    // === "Class" methods
    m.new            = Model.new_instance;
    m.to_client_side = Model.class_to_client_side;

    // === "instance" methods
    m.prototype.update   = Model.instance_update;
    m.prototype.get_data = Model.instance_get_data;

    return m;
  },

  SQL : function (sql) {
    if (!Model.replace_table) {
      Model.replace_table = new RegExp('@(' + Model.map_keys.join('|') + ')','ig')
    }

    var reg_ex = Model.replace_table;
    return sql.replace(reg_ex, function (full, name) {
      return '"' + (Model.map[name].TABLE_NAME || s) + '"';
    });
  }

};


exports.Model = Model;




