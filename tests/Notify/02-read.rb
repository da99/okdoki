
require './tests/helpers'
require './Server/Notify/model'

describe "Notify: read_inbox" do

  before do
    Notify::TABLE.delete
    @sn1 = Screen_Name_Test.screen_name 0
    @sn2 = Screen_Name_Test.screen_name 1
    @sn3 = Screen_Name_Test.screen_name 2
    @sn4 = Screen_Name_Test.screen_name 3
  end

  it "retrieves messages in DESC :updated_at, :created_at" do
    n1 = Notify.create_or_update @sn1, @sn4, "body 1"
    n2 = Notify.create_or_update @sn2, @sn4, "body 2"
    n3 = Notify.create_or_update @sn3, @sn4, "body 3"

    msgs = Notify.read_inbox @sn4
    msgs.map(&:id).should == [n3.id, n2.id, n1.id]
  end

  it "does not retrieve messages meant for others" do
    n1 = Notify.create_or_update @sn1, @sn4, "body 1"
    n2 = Notify.create_or_update @sn2, @sn4, "body 2"
    n3 = Notify.create_or_update @sn1, @sn4, "body 3"

    msgs = Notify.read_inbox @sn4
    msgs.map(&:id).should == [n2.id, n1.id]
  end

end # === describe Notify: read ===


