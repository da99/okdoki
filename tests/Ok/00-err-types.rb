
require "./tests/helpers"
require "./Server/Ok/model"

class My_Model
  include Ok::Model
end

describe "Exceptions:" do

  it "defines an Invalid exception" do
    My_Model::Invalid.superclass.should == Ok::Invalid
  end

  it "defines an Not_Found exception" do
    My_Model::Not_Found.superclass.should == Ok::Not_Found
  end

end # === describe Exceptions: ===

