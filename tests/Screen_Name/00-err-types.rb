
require './Server/Screen_Name/model'
require 'Bacon_Colored'

describe "Screen_Name: exceptions" do

  it "defines an Invalid exception" do
    Screen_Name.const_defined?(:Invalid).should.be.equal true
  end

end # === describe Screen_Name: exceptions ===


