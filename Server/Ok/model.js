var _ = require('underscore')._
;

exports.Model = {
  new : function (m) {

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
      return o;
    };

    m.prototype.update = function () {
      if (!this.is_update_able())
        return _.last(arguments).finish();
      return this._update.apply(this, arguments);
    };

    m.prototype.get_data = exports.Model.get_data;
    return m;
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
