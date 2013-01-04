
var pg = require('okdoki/lib/POSTGRESQL');
var _ = require('underscore')
, shortid = require('shortid');


function Screen_names(customer) {
  if (!customer)
    throw new Error('A customer is required.');
  this.Customer = customer;
  this.rows = [];
  this.list = [];
  this.sanitized_data = {};
}


Screen_names.prototype.push = function (row) {
  this.rows.push(row);
  this.list = _.pluck(this.list, 'screen_name');
  return this;
};

Screen_names.prototype.validate = function () {

  var me = this;
  var c = me.Customer;

  if (c.is_new) {

    c.new_screen_name(c.new_data.screen_name);

  } else {

    if (!c.new_data.old_screen_name)
      return me;

    c.new_screen_name(c.new_data.new_screen_name);

  }

};

Screen_names.prototype.to_id = function (name) {
  var rows = this.Customer.Screen_names.rows;
  var r = _.find(rows, function (row) { return row.screen_name === name; });
  if (!r)
    throw new Error('Id not found for customer, ' + this.Customer.data.id + ' and name: ' + name);

  return r.id;
};

exports.Screen_names = Screen_names;






