var _      = require('underscore')
, Customer = require('okdoki/lib/Customer').Customer
, River    = require('okdoki/lib/River').River
, PG    = require('okdoki/lib/PG').PG
;

var reltime = require('reltime');

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
  return reltime.parse((new Date), english);
}


Customer.delete_all = function (flow) {

  River.new(flow)
  .job('clear previous', function (j) {
    PG.new('clear customers', j)
    .delete_all('customers')
    .delete_all('screen_names')
    .run()
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

