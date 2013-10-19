
require './tests/helpers'
require './Server/Notify/model'

include Screen_Name_Test

describe "Notify: create_or_update" do

  before do
    Notify::TABLE.delete
    @sn1 = Screen_Name_Test.screen_name(0)
    @sn2 = Screen_Name_Test.screen_name(1)
  end

  it "creates notify if it does not exist" do
    msg1 = "Something #{rand 1000}"
    Notify.create_or_update @sn1, @sn2, msg1

    Notify::TABLE.first[:body].should == msg1
  end

  it "updates notify if it exists" do
    Notify.create_or_update @sn1, @sn2, "body 1"

    msg1 = "Something #{rand 1000}"
    Notify.create_or_update @sn1, @sn2, msg1

    Notify::TABLE.first[:body].should == msg1
  end

  it "sets :from_id" do
    msg1 = "Something #{rand 1000}"
    Notify.create_or_update @sn1, @sn2, msg1

    Notify::TABLE.first[:from_id].should == @sn1.id
  end

  it "sets :to_id" do
    msg1 = "Something #{rand 1000}"
    Notify.create_or_update @sn1, @sn2, msg1

    Notify::TABLE.first[:to_id].should == @sn2.id
  end

end # === describe Notify: create ===


