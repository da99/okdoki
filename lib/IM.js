var _ = require('underscore');


var IM = exports.IM = function (data) {
}

IM.keys = "body to from labels cid okid ref_cid ref_okid".split(" ");

IM.new = function (data) {
  var im = new IM();
  im.data = ({});

  im.from(data.from || "");
  im.to(data.to || "");
  im.labels( data.labels || "");
  im.body( data.body || "");
  im.body( data.cid || "");

  return im;
};

IM.uniq_str = function(str) {
  return _.uniq( _.map( str.split(" "), function(v){
    return v.trim();
  })).join(' ').trim();
}

IM.prototype.body = function (v) {
  var me = this;
  if (arguments.length === 0)
    return me.data.body;

  me.data.body = (v || "").trim();

  return me.data.body;
};

_.each(IM.keys, function (v) {
  IM.prototype[v] = new Function(
  " var me = this; " +
  " var this_name = '" + v + "'; \n" +
  " if (arguments.length === 0) " +
  "   return me.data." + v + "; \n" +
  " me.data." + v + " = me.constructor.uniq_str((me.data." + v + ' || "") + " " + (arguments[0] || "")); ' +
  " return me; "
  );
});

