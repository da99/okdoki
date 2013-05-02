var _         = require('underscore')
, assert      = require('assert')
, Topogo      = require('topogo').Topogo
, River       = require('da_river').River
, Check       = require('da_check').Check
, Customer    = require('../Server/Customer/model').Customer
, Screen_Name = require('../Server/Screen_Name/model').Screen_Name
, Home_Page   = require('../Server/Home_Page/model').Home_Page
, Contact     = require('../Server/Contact/model').Contact
, h           = require('./helpers')
;

function read(from, to, flow) {
  return Home_Page.read({from: from, screen_name: to}, flow);
}

describe( 'Home_Page', function () {

  var sn_1 = 'hp_sn_1', sn_2 = 'hp_sn_2', sn_3 = 'hp_sn_3';
  var c1, c2, c3;

  before(function (done) {
    River.new(null)
    .job('clear'  , 'data', [Customer, 'delete_all'])
    .job('create' , 'c1',   [Customer, 'create_sample', sn_1])
    .job('create' , 'c2',   [Customer, 'create_sample', sn_2])
    .job('create' , 'c3',   [Customer, 'create_sample', sn_3])
    .job('update' , 'privacy', [h, 'open_screen_names'])
    .job('update' , 'vars', function (j) {
      c1 = j.river.reply_for('create', 'c1');
      c2 = j.river.reply_for('create', 'c2');
      c3 = j.river.reply_for('create', 'c3');
      j.finish();
    })
    .job('contact', 'c1->c2', function (j) { Contact.create({from: c1, to: sn_2}, j); })
    .job('contact', 'c2->c3', function (j) { Contact.create({from: c2, to: sn_3}, j); })
    .job('protect', 'c2',     function (j) { Screen_Name.update({owner: c2, screen_name: sn_2, read_able: ['@P']}, j); })
    .job('protect', 'c3',     function (j) { Screen_Name.update({owner: c3, screen_name: sn_3, read_able: ['@N']}, j); })
    .run(function (r) {
      done();
    });
  });

  describe( 'create', function () {
    it( 'is not created after screen name is created', function (done) {
      River.new(null)
      .job( 'read', function (j) {
        Home_Page.TABLE.read_list({owner_id: sn_1}, j);
      })
      .job(function (j, rows) {
        assert.equal(rows.length, 0);
        done();
      })
      .run();
    });
  }); // === end desc create

  describe( 'read', function () {
  }); // === end desc read

  describe( 'update', function () {

    it( 'creates a home_page if it does not exist', function (done) {
      var about = 'This is a new about.';
      River.new(null)
      .job('update', sn_1, [Home_Page, 'update', {screen_name: sn_1, owner: c1, about: about}])
      .job('read', sn_1, function (j) {
        read(c1, sn_1, j)
      })
      .run(function (j, last) {
        assert.equal(last.data.about, about);
        done();
      });
    });

  }); // === end desc update

}); // === end desc Home_Page










