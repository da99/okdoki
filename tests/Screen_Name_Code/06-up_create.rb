
require './Server/Screen_Name_Code/model'

describe "Screen_Name_Code: up_create" do

  before do
    Screen_Name_Code::TABLE.delete
    @sn = Screen_Name_Test.screen_name(1)
  end

  it "creates row if it does not exist" do
    r = Screen_Name_Code.up_create @sn, "on view profile", "[]"
    raw = Screen_Name_Code::TABLE.where(:screen_name_id=>@sn.id).first
    raw[:id].should == r.id
  end

  it "updates if row exists" do
    r = Screen_Name_Code.up_create @sn, "on view profile", "[]"
    code = '["success_msg", ["hello"]]'
    Screen_Name_Code.up_create @sn, "ON view profile", code
    raw = Screen_Name_Code::TABLE.where(:screen_name_id=>@sn.id).first
    raw[:code].should == MultiJson.dump(Okdoki::Escape_All.escape(MultiJson.load(code)))
  end

end # === describe Screen_Name_Code: up_create ===


