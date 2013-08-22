
require './Server/Screen_Name/model'
require 'Bacon_Colored'

describe "Screen Name: Errors" do

  it "defines an Invalid exception" do
    Screen_Name.const_defined?(:Invalid).should.be.equal true
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

end # === describe
