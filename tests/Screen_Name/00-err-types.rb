
require './Server/Screen_Name/model'
require 'Bacon_Colored'

describe "Screen_Name: exceptions" do

  it "defines an Invalid exception" do
    Screen_Name::Invalid.superclass.should == Ok::Invalid
  end

  it "defines an Not_Found exception" do
    Screen_Name::Not_Found.superclass.should == Ok::Not_Found
  end

end # === describe Screen_Name: exceptions ===


