
require './tests/helpers'
require './Server/Customer/model'

include Screen_Name::Test

describe "Screen Name: create" do

  it "creates record if data validates" do
    name = new_name
    sn = Screen_Name.create(:screen_name=>name, :customer=>Customer.new(id: 0))
    Screen_Name::TABLE.where(:id=>sn.data[:id])
    .first[:screen_name]
    .should.equal name.upcase
  end

end # === describe

describe "Screen Name: create :screen_name" do

  it "raises Invalid if screen name is empty" do
    lambda {
      Screen_Name.create({:screen_name=>""})
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name must be: /)
  end

  it "megauni is not allowed (despite case)" do
    lambda {
      Screen_Name.create({:screen_name=>'meGauNi'})
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name not allowed/)
  end

  it "raises Invalid for duplicate name" do
    name = new_name
    lambda {
      Screen_Name.create(:customer=>Customer.new, :screen_name=>name)
      Screen_Name.create(:customer=>Customer.new, :screen_name=>name)
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name already taken: #{name}/i)
  end

end # === describe
