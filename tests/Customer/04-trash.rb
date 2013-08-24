
require './tests/helpers'
require './Server/Customer/model'


describe( 'trash', function () {

  it( 'it updates Customer trashed_at date', function (done) {
  var f = '%Y-%m-%dT%H:%M';
  River.new('trash customer', null)
  .job('trash customer', customer_id, [customer, 'trash'])
  .job('assert trashed_at changed', function (j, last) {
    assert.equal(h.is_recent(customer.data.trashed_at), true);
    j.finish(customer);
  })
  .job('read customer', customer_id, [Customer, 'read_by_id', customer_id])
  .run(function (r, last) {
    var c = last;
    assert.equal(h.is_recent(c.data.trashed_at), true);
    done();
  });
}); // it

}); // === describe trash




