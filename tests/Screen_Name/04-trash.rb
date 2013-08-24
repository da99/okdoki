require './tests/helpers'


def create
  name = new_name
  c = Customer.new(data: 0)
  sn = Screen_Name.create(:screen_name=>name, :customer=>c)
  {name: name, c: c, sn: sn, id: sn.data[:id]}
end

def find o
  Screen_Name::TABLE[id: o[:sn].data[:id]]
end


describe "Screen_Name" do

  describe 'trash' do

    it "it updates screen-name's :trashed_at to now @ UTC" do
      o = create
      o[:sn].trash
      updated = find(o)
      updated[:trashed_at].should.be within_secs(3)
    end # === it

  end # === describe trash ===

  describe 'untrash' do

    it "it updates screen-name's :trashed_at to nil" do
      o = create
      o[:sn].trash
      o[:sn].untrash
      new_sn = find(o)
      new_sn[:trashed_at].should.equal nil
    end # === it

  end # === describe trash ===

end # === describe Screen_Name ===


