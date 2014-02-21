
require './tests/helpers'
require './Server/Screen_Name_Code/model'

describe "Screen_Name_Code: create" do

  before do
    Screen_Name_Code::TABLE.delete
  end

  it "creates a record with :screen_name_id == id of owner" do
    sn = Screen_Name_Test.screen_name(1)
    r = Screen_Name_Code.create sn, "on profile view", "[]"
    raw = Screen_Name_Code::TABLE.where(id: r.data.id).all
    raw.last[:screen_name_id].should == sn.data.id
  end

end # === describe Screen_Name_Code: create ===


