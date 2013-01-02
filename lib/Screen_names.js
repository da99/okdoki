
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

Screen_names.prototype.new_screen_name = function (val) {
  this.Customer.validator.check(val, 'Name must be 3-15 chars: 0-9 a-z A-Z _ - .').is(/^[a-z0-9\-\_\.]{3,15}$/i);
};

Screen_names.prototype.push = function (row) {
  this.rows.push(row);
  this.list = _.pluck(this.list, 'screen_name');
  return this;
};

Screen_names.prototype.validate = function () {
  var c = this.Customer;
  if (c.is_new) {
    this.new_screen_name(this.Customer.new_data.mask_name);
  } else {
    if (c.new_data.old_screen_name)
      throw new Error('Not ready.');
  };
};

Screen_names.prototype.create = function (db) {
  var me = this;
  var c  = this.Customer;
  var id = shortid.seed(c).generate();
  var sql = 'INSERT INTO screen_names (id, customer_id, screen_name) VALUES ($1, $2, $3);';
  db.q(sql, [id, c.sanitized_data.id, c.sanitized_data.screen_name]);
  me.sanitized_data.id = id;
};

Screen_names.prototype.after_create = function () {
  var me = this;
  var c = this.Customer;
  this.rows.push({id: me.sanitized_data.id, customer_id: c.data.id, screen_name: c.sanitized_data.screen_name});
  this.Customer.data.screen_names = this.list;
};


exports.Screen_names = Screen_names;






