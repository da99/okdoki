
require './Server/Screen_Name/model'
require './Server/Customer/model'
require 'Bacon_Colored'

describe "Screen Name: create" do

  it "creates record if data validates" do
    sn = Screen_Name.create(:screen_name=>'ted1', :customer=>Customer.new(id: 0))
    Screen_Name::TABLE.where(:id=>sn.data[:id])
    .first[:screen_name]
    .should.equal "TED1"
  end

end # === describe

describe "Screen Name: create :screen_name" do

  it "raises Invalid, not be empty" do
    lambda {
      Screen_Name.create({:screen_name=>""})
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name .+ not be empty/)
  end

  it "megauni is not allowed (despite case)" do
    lambda {
      Screen_Name.create({:screen_name=>'meGauNi'})
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name not allowed/)
  end

  it "raises Invalid for duplicate name" do
    lambda {
      Screen_Name.create(:screen_name=>"ted3")
      Screen_Name.create(:screen_name=>"ted3")
    }.should.raise(Screen_Name::Invalid).

    message.
    should.match(/Screen name already taken: ted3/i)
  end

end # === describe
