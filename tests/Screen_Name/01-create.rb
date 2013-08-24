
require './tests/helpers'
require './Server/Customer/model'

include Screen_Name::Test

describe "Screen Name: create" do

  it "creates record if data validates" do
    name = new_name
    sn = Screen_Name.create(:screen_name=>name, :customer=>Customer.new({}))
    Screen_Name::TABLE.where(:id=>sn.data[:id])
    .first[:screen_name]
    .should.equal name.upcase
  end

  it "raises Invalid if screen name is empty" do
    lambda {
      Screen_Name.create({:screen_name=>"", :customer=>Customer.new({})})
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name must be: /)
  end

  it "megauni is not allowed (despite case)" do
    lambda {
      Screen_Name.create({:screen_name=>'meGauNi', :customer=>Customer.new({})})
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name not allowed/)
  end

  it "raises Invalid for duplicate name" do
    name = new_name
    lambda {
      Screen_Name.create(:customer=>Customer.new({}), :screen_name=>name)
      Screen_Name.create(:customer=>Customer.new({}), :screen_name=>name)
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name already taken: #{name}/i)
  end

  it "updates :owner_id (of returned SN obj) to its :id if Customer is new and has no id" do
    name = new_name
    sn = Screen_Name.create(:screen_name=>name, :customer=>Customer.new({}))
    assert :equal, sn.data[:id], sn.data[:owner_id]
  end

  it "updates :owner_id (of customer.clean_data) to its :id if Customer is new and has no id" do
    name = new_name
    c    = Customer.new({})
    sn = Screen_Name.create(:screen_name=>name, :customer=>c)
    assert :equal, sn.data[:id], c.clean_data[:id]
  end

end # === describe
