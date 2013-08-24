
require './tests/helpers'
require './Server/Customer/model'

describe 'delete_trashed' do

  it 'it does not delete Customer records less than 2 days old' do
    trashed_at = h.ago('-1d -22h')

    Customer::TABLE.
      where(id: customer_id).
      update(trashed_at: trashed_at)

    Customer.empty_trash

    last = Customer.read_by_id customer_id

    age = h.utc_diff(last.data.trashed_at)
    almost_2_days = h.utc_diff(h.ago('-1d -22h'))
    assert :equal, (age - almost_2_days) < 1000, true
  end # === it

  it 'it deletes Customer and Screen-Names records more than 2 days old' do

    Customer::TABLE.
      where(id: customer_id).
      update trashed_at: h.ago('-3d')

    Customer.empty_trash

    lambda {
      Customer.read_by_id customer_id
    }.should.raise(Customer::Not_Found).
      message.
      should.match "Customer, #{customer_id}, not found."


    # read screen names
    rows = Screen_Name::TABLE.where(owner_id: customer_id)
    assert :equal, rows.length, 0
  end # === it

end # === describe delete


