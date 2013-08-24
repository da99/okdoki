
require './tests/helpers'
require './Server/Customer/model'



describe( 'update:', function () {

  it('updates Customer email', function (done) {
  var new_email = 'new-email@i-hate-all.com';
  River.new(null)
  .on_next('invalid', h.throw_it)
  .job('update customer', new_email, [customer, 'update', {'email': new_email}])
  .job('assert new email', function (j) {
    assert.equal(customer.data.email, new_email);
    j.finish(customer.data.email);
  })
  .job('read customer', customer_id, [Customer, 'read_by_id', customer_id])
  .run(function (r, last) {
    assert.equal(last.data.email, new_email);
    done();
  });
}); // it

}); // === describe update







