var _         = require('underscore')
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, River       = require('okdoki/lib/River').River
, Topogo      = require('okdoki/lib/Topogo').Topogo
;

var reltime = require('reltime');

exports.open_screen_names = function (j) {
  PG.new(j)
  .q('UPDATE ' + Screen_Name.TABLE_NAME + ' SET read_able = $1 RETURNING id ;', ['W'])
  .run()
};

exports.throw_it = function () {
  throw new Error(arguments[0].toString());
  return false;
}

exports.utc_timestamp = function () {
  var d = new Date;
 return (d.getTime() + d.getTimezoneOffset()*60*1000);
}

exports.utc_diff = function (date) {
  return exports.utc_timestamp() - (date).getTime();
}
exports.is_recent = function (date) {
  if (_.isNumber(date) && !_.isNaN(date))
    return ((new Date()).getTime() - date) < 500;
  return exports.utc_diff(date) < 1000;
}

exports.ago = function (english) {
  switch (english) {
    case '-1d -22h':
      exports.utc_timestamp() - (1000 * 60 * 60 * 24) - (1000 * 60 * 60 *22);
      break;
    case '-3d':
      exports.utc_timestamp() - (1000 * 60 * 60 * 24 * 3);
      break;
    default:
      throw new Error('Unknown: ' + english);
  };
  return reltime.parse((new Date), english).getTime();
}

Topogo.prototype.delete_all = function (flow) {
  var sql = 'DELETE FROM ' + this.table + ' ;';
  return this.run(sql, {}, flow);
};

Customer.delete_all = function (flow) {

  River.new(flow)
  .job('delete customers', function (j) {
    Topogo.new(Customer.TABLE_NAME).delete_all(j);
  })
  .job('delete screen_names', function (j) {
    Topogo.new(Screen_Name.TABLE_NAME).delete_all(j);
  })
  .run();

}; // end .delete_all

Customer.create_sample = function (sn, flow) {

  var o = {
    screen_name         : sn,
    pass_phrase         : "this is a pass",
    confirm_pass_phrase : "this is a pass",
    ip                  : '000.00.000'
  };

  River.new(flow)
  .job('create customer', [Customer, 'create', o])
  .run();

}; // end .create_sample

