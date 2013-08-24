
require './tests/helpers'
require './Server/Customer/model'

describe "Customer: exceptions" do

  it "defines an Invalid exception" do
    Customer::Invalid.superclass.should == Ok::Invalid
  end

  it "defines an Not_Found exception" do
    Customer::Not_Found.superclass.should == Ok::Not_Found
  end

end # === describe Customer: exceptions ===


