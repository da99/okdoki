
require './tests/helpers'
require './Server/Screen_Name_Code/model'

describe "Screen_Name_Code: create" do

  before do
    @sn = Screen_Name_Test.screen_name(1)
    Screen_Name_Code::TABLE.delete
  end

  it "creates a record with :screen_name_id == id of owner" do
    r = Screen_Name_Code.create @sn, "on view profile", "[]"
    raw = Screen_Name_Code::TABLE.where(id: r.id).all
    raw.last[:screen_name_id].should == @sn.id
  end

  it "raises Invalid if screen_name_id, event_name_id already exists" do
    lambda {
      Screen_Name_Code.create @sn, "on view profile", "[]"
      Screen_Name_Code.create @sn, "on view profile", "[]"
    }.should.raise(Screen_Name_Code::Invalid).
    message.
    should.match(/Code already exists for:/)
  end

  it "escapes :code" do
    code = '["a", ["\""]]'
    r = Screen_Name_Code.create @sn, "on view profile", '["a", ["\""]]'
    raw = Screen_Name_Code::TABLE.where(:id=>r.id).first
    raw[:code].should == MultiJson.dump(Okdoki::Escape_All.escape MultiJson.load(code))
  end

end # === describe Screen_Name_Code: create ===


