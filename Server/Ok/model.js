var _ = require('underscore')._
;

exports.Model = {
  new : function (m) {
    m.prototype.update = function () {
      if (!this.is_update_able())
        return flow.finish();
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
