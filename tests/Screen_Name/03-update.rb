
require './Server/Screen_Name/model'
require './Server/Customer/model'
require 'Bacon_Colored'

def counter
  @i ||= 1
  @i += 1
end

def customer
  Customer.new
end



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

lambda {
describe 'trash' do

  before do
    create_test_customer
  end

  it 'it updates screen-name\'s :trashed_at to UTC now' do
    f  = '%Y-%m-%dT%H:%M'
    id = c.screen_name_id(sn)

    Screen_Name.trash(id)
    reply = Screen_Name::TABLE[:id=>id].first
    reply.trashed_at.should.not.equal nil
  end # === it

end # === describe

describe 'untrash' do

  before do
    create_test_customer
  end

  it 'it updates screen-name\'s :trashed_at to null' do
    f = '%Y-%m-%dT%H:%M'
    id = c.screen_name_id(sn)
    Screen_Name.trash(id)
    Screen_Name.untrash(id)
    new_sn = Screen_Name::TABLE[:id=>id].first

    new_sn.trashed_at.should.equal nil

  end # === it

end # === describe

describe 'delete' do

  before do
    create_test_customer
    create_test_customer
  end

  it 'it deletes screen-name record of more than 2 days old' do
    id = c.screen_name_id(sn)

    Screen_Name::TABLE.where(:id=>id).update(:trashed_at=>h.ago('-3d'))
    Screen_Name.delete_trashed()
    last = Customer.read_by_id(c.datta[:id])

    last.screen_names.size.should.equal 0
  end # === it

end # === describe delete

}









