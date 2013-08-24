
require './tests/helpers'
require './Server/Customer/model'



describe 'update:' do

  it 'updates Customer email' do
    new_email = 'new-email@i-hate-all.com';
    customer.update  email: new_email
    assert :equal, customer.data[:email], new_email

    last = Customer.read_by_id customer_id
    assert :equal, last.data[:email], new_email
  end # === it

end # === describe update







