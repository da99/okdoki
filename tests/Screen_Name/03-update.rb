
require './Server/Screen_Name/model'
require 'Bacon_Colored'

Cache = {:customer=>nil}

def customer c = nil
  @customer = c if c
  @customer
end

def counter
  @i ||= 1
  @i += 1
end

def create_test_customer done
  sn = "SN_" + counter;
  sn_updated = sn + "_UPDATED";
  c_opts = {
    :screen_name         => sn.downcase,
    :pass_phrase         => "this is a pass phrase",
    :confirm_pass_phrase => "this is a pass phrase",
    :ip                  => '000.00.000'
  };

  customer Customer.create(c_opts)
end

describe 'Screen_Name' do

  before do
    Customer.delete_all
  end

  describe 'create:' do

    it 'saves screen_name to datastore' do

      c = {
        :new_data => { :ip => '000000', :screen_name => 'mem1' },
        :data => {:id => '0'},
        :push_screen_name_row => lambda { |r| this.row = r }
      }

      Screen_Name.create(c)
      sn = Screen_Name::TABLE[:screen_name=>'MEM1'].first

      sn.data.screen_name.should.equal 'MEM1'
    end # === it

  end # === describe


  describe 'update:' do

    before do
      create_test_customer
    end

    it 'updates screen name' do

      sn_opts = {
        :old_screen_name => sn,
        :screen_name     => sn_updated.downcase
      }

      c.new_data = sn_opts
      Screen_Name.update c

      c.screen_names.should.equal [sn_updated]
      sn = sn_updated

    end # === it

  end # === describe update

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

end # === describe Screen_Name









