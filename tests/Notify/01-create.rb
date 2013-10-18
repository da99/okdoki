
require './tests/helpers'
require './Server/Notify/model'

include Screen_Name_Test

describe "Notify: create_or_update" do

  before do
    Notify::TABLE.delete
    @sn1 = Screen_Name_Test.screen_name(0)
  end

  it "creates notify if it does not exist" do
    msg1 = "Something #{rand 1000}"
    Notify.create_or_update @sn1, msg1

    Notify::TABLE.first[:body].should == msg1
  end

  it "updates notify if it exists" do
    Notify.create_or_update @sn1, "body 1"

    msg1 = "Something #{rand 1000}"
    Notify.create_or_update @sn1, msg1

    Notify::TABLE.first[:body].should == msg1
  end

end # === describe Notify: create ===


