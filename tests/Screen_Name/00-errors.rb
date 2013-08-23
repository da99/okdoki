
require './Server/Screen_Name/model'
require 'Bacon_Colored'

describe "Screen Name: Errors" do

  it "defines an Invalid exception" do
    Screen_Name.const_defined?(:Invalid).should.be.equal true
  end

end # === describe

