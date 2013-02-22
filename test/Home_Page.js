var _         = require('underscore')
, assert      = require('assert')
, IM          = require('okdoki/lib/IM').IM
, SQL         = require('okdoki/lib/SQL').SQL
, PG          = require('okdoki/lib/PG').PG
, River       = require('okdoki/lib/River').River
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
, Home_Page   = require('okdoki/lib/Home_Page').Home_Page
, Contact     = require('okdoki/lib/Contact').Contact
, h           = require('okdoki/test/helpers')
;

function read(from, to, flow) {
  return Home_Page.read({from: from, screen_name: to}, flow);
}

describe( 'Home_Page', function () {

  var sn_1 = 'hp_sn_1', sn_2 = 'hp_sn_2', sn_3 = 'hp_sn_3';
  var c1, c2, c3;

  before(function (done) {
    River.new()
    .job('clear', 'data', [Customer, 'delete_all'])
    .job('create','c1', [Customer, 'create_sample', sn_1])
    .job('create','c2', [Customer, 'create_sample', sn_2])
    .job('create','c3', [Customer, 'create_sample', sn_3])
    .job('update', 'vars', function (j) {
      c1 = j.river.reply_for('create', 'c1');
      c2 = j.river.reply_for('create', 'c2');
      c3 = j.river.reply_for('create', 'c3');
      j.finish();
    })
    .job('contact', 'c1->c2', function (j) { Contact.create({from: c1, to: sn_2}, j); })
    .job('contact', 'c2->c3', function (j) { Contact.create({from: c2, to: sn_3}, j); })
    .job('protect', 'c2',     function (j) { Screen_Name.update({owner: c2, screen_name: sn_2, read_able: 'C'}, j); })
    .job('protect', 'c3',     function (j) { Screen_Name.update({owner: c3, screen_name: sn_3, read_able: 'N'}, j); })
    .run_and_on_finish(function (r) {
      done();
    });
  });

  describe( 'create', function (done) {
    it( 'is not created after screen name is created', function (done) {
      PG.new().q(SQL.select('*').from(Home_Page.TABLE_NAME).where('owner_id', sn_1))
      .run_and_on_finish(function (rows) {
        assert.equal(rows.length, 0);
        done();
      });
    });
  }); // === end desc create

  describe( 'read', function () {
  }); // === end desc read

  describe( 'update', function () {

    it( 'creates a home_page if it does not exist', function (done) {
      var about = 'This is a new about.';
      River.new()
      .job('update', sn_1, [Home_Page, 'update', {screen_name: sn_1, owner: c1, about: about}])
      .job('read', sn_1, function (j) {
        read(c1, sn_1, j)
      })
      .run_and_on_finish(function (r) {
        assert.equal(r.last_reply().data.about, about);
        done();
      });
    });

  }); // === end desc update

}); // === end desc Home_Page










