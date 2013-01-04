
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

Screen_names.read = function (customer, on_fin, on_err) {
  var db = new pg.query('SELECT * FROM screen_names WHERE customer_id = $1', [customer.data.id]);
  db.run_and_then(function (meta) {
    if (meta.rowCount === 0) {
      if (on_err)
        on_err(meta);
      else
        throw new Error('No screen names found for: ' + customer.data.id);
    } else {
      customer.data.screen_names = _.pluck(meta.rows, 'screen_name');
      var sn = (customer.Screen_names || new Screen_names(customer));
      sn.rows = meta.rows;
      on_fin(customer, meta);
    }
  });
};


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






