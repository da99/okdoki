
var _         = require('underscore')
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Validate    = require('okdoki/lib/Validate').Validate
, UID         = require('okdoki/lib/UID').UID
, PG          = require('okdoki/lib/PG').PG
, SQL         = require('okdoki/lib/SQL').SQL
, River       = require('okdoki/lib/River').River
;

var Home_Page = exports.Home_Page = function () {};
Home_Page.TABLE_NAME = 'home_pages';

Home_Page.new = function (row) {
  var hp = new Home_Page();

  return hp;
};


// ****************************************************************
// ****************** Create **************************************
// ****************************************************************

Home_Page.create = function (vals, flow) {
  return flow.finish(this);
};


// ****************************************************************
// ****************** Read ****************************************
// ****************************************************************

Home_Page.read = function (vals, flow) {
  return flow.finish({data: {}});
};


// ****************************************************************
// ****************** Update **************************************
// ****************************************************************


Home_Page.update = function (vals, flow) {
  return flow.finish(this);
};
