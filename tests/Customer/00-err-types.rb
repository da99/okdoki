
require './tests/helpers'
require './Server/Customer/model'

describe "Customer: exceptions" do

  it "defines an Invalid exception" do
    Customer.const_defined?(:Invalid).should.be.equal true
  end

end # === describe Customer: exceptions ===


