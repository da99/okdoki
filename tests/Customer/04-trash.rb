
require './tests/helpers'
require './Server/Customer/model'

include Customer_Test
OC = create_screen_name
C  = OC[:c]

describe 'trash' do

  it 'it updates Customer trashed_at date' do

    c = Customer.read_by_id(C.data[:id])
    c.trash

    updated = Customer.read_by_id(C.data[:id])
    assert within_secs(2), updated.data[:trashed_at]

  end # === it

end # === describe trash




