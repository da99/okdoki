
require './Server/Screen_Name/model'
require './Server/Customer/model'
require 'Bacon_Colored'

describe 'Screen-Name:' do

  before do
    `bin/migrate reset`
  end

  describe ":update" do

    it 'updates screen name' do
      c = Customer.new
      Screen_Name.create(screen_name: 'ted1', customer: c)
      sn = c.screen_names['ted1']
      sn.update screen_name: 'ted2'

      rec = Screen_Name::TABLE[screen_name: 'TED2']
      rec[:id].should.equal sn.data[:id]
    end # === it

  end # === describe

end # === describe update










