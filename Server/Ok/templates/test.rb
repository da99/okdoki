
require './tests/helpers'
require './Server/MODEL/model'

describe "MODEL: !sub_action" do

  it "defines an Invalid exception" do
    MODEL.const_defined?(:Invalid).should.be.equal true
  end

end # === describe MODEL: !sub_action ===


