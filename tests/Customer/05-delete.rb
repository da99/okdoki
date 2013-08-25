
require './tests/helpers'
require './Server/Customer/model'

include Customer::Test
OC = create
C  = OC[:c]

describe 'delete_trashed' do

  it 'it does not delete Customer records less than 2 days old' do
    Customer::TABLE.
      where(id: C.data[:id]).
      update(trashed_at: Sequel.lit(" #{Ok::Model::PG::UTC_NOW_RAW} - interval '70 hours' "))

    Customer.empty_trash

    last = Customer.read_by_id C.data[:id]
    assert :==, C.data[:id], last.data[:id]
  end # === it

  it 'it deletes Customer and Screen-Names' do
    Customer::TABLE.
      where(id: C.data[:id]).
      update(trashed_at: Sequel.lit(" #{Ok::Model::PG::UTC_NOW_RAW} - interval '72 hours' "))

    Customer.empty_trash

    lambda {
      Customer.read_by_id C.data[:id]
    }.should.raise(Customer::Not_Found).
      message.
      should.match(/Customer not found./)

    # read screen names
    count = Screen_Name::TABLE.where(owner_id: C.data[:id]).count
    assert :==, count, 0
  end # === it

end # === describe delete


