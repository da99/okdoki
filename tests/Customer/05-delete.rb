
require './tests/helpers'
require './Server/Customer/model'

describe( 'delete_trashed', function () {

  it( 'it does not delete Customer records less than 2 days old', function (done) {
  var trashed_at = h.ago('-1d -22h');

  River.new(null)
  .job('update trashed_at', function (j) {
    Topogo.new(Customer.TABLE_NAME)
    .update_where_set(customer_id, { trashed_at: trashed_at }, j)
  })
  .job('delete customers', [Customer, 'delete_trashed'])
  .job('read customer', [Customer, 'read_by_id', customer_id])
  .run(function (r, last) {
    var age = h.utc_diff(last.data.trashed_at);
    var almost_2_days = h.utc_diff(h.ago('-1d -22h'));
    assert.equal( (age - almost_2_days) < 1000, true);
    done();
  });
}); // it

it( 'it deletes Customer and Screen-Names records more than 2 days old', function (done) {

  River.new(null)

  .job('update trashed_at', function (j) {
    Topogo.new(Customer.TABLE_NAME)
    .update_where_set(customer_id, {trashed_at: h.ago('-3d')}, j)
  })

  .job('delete customers', [Customer, 'delete_trashed'])

  .on_next('not_found', function (j, err) {

    assert.equal(err.message, "Customer, " + customer_id + ', not found.');

    River.new(null)
    .job('read screen names', function (j) {
      Topogo.new(Screen_Name.TABLE_NAME)
      .read_list({owner_id: customer_id}, j);
    })
    .job(function (j, rows) {
      assert.equal(rows.length, 0);
      done();
    })
    .run();
  })

  .job('read customer', [Customer, 'read_by_id', customer_id])

  .run(function () {
    throw new Error('Should not be reached.');
  });
}); // it

}); // === describe delete


