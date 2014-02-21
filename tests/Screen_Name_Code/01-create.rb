
require './tests/helpers'
require './Server/Screen_Name_Code/model'

describe "Screen_Name_Code: create" do

  before do
    Screen_Name_Code::TABLE.delete
  end

  it "creates a record with :screen_name_id == id of owner" do
    sn = Screen_Name_Test.screen_name(1)
    r = Screen_Name_Code.create sn, Screen_Name_Code.to_event_name_id("on profile view"), "[]"
    raw = Screen_Name_Code::TABLE.where(id: r.id).all
    raw.last[:screen_name_id].should == sn.id
  end

end # === describe Screen_Name_Code: create ===


