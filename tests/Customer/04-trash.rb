
require './tests/helpers'
require './Server/Customer/model'


describe 'trash' do

  it 'it updates Customer trashed_at date' do

    customer = Customer.read_by_id(customer_id)
    customer.trash

    assert within_secs(2), customer.data[:trashed_at]

    c = Customer.read_by_id(customer_id)

    assert within_secs(2), c.data[:trashed_at]

  end # === it

end # === describe trash




