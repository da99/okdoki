require './tests/helpers'

describe "Screen_Name" do

  describe 'trash' do

    it "it updates screen-name's :trashed_at to now @ UTC" do
      name = new_name
      c = Customer.new(data: 0)
      sn = Screen_Name.create(:screen_name=>name, :customer=>c)

      sn.trash
      reply = Screen_Name::TABLE[:id=>sn.data[:id]]
      diff = (Time.now.utc.to_i - reply[:trashed_at].to_i)
      diff.should.be less_than(3)
    end # === it

  end # === describe trash ===

  describe 'untrash' do

    it "it updates screen-name's :trashed_at to nil" do
      id = c.screen_name_id(sn)
      Screen_Name.trash(id)
      Screen_Name.untrash(id)
      new_sn = Screen_Name::TABLE[:id=>id].first

      new_sn.trashed_at.should.equal nil

    end # === it

  end # === describe trash ===





end # === describe Screen_Name ===


