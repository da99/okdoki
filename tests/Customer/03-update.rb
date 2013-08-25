
require './tests/helpers'
require './Server/Customer/model'

include Customer::Test

OC = create
C  = OC[:c]

describe 'update:' do

  it 'updates Customer email in instance' do
    new_email = 'new-email@i-hate-all.com'
    C.update  email: new_email
    assert :==, new_email, C.data[:email]
  end # === it

  it 'updates Customer email in db' do
    new_email = 'new@i-hate-all.com.something'
    C.update(email: new_email)

    last = Customer.read_by_id(C.data[:id])
    assert :equal, new_email, last.data[:email]
  end # === it

end # === describe update







