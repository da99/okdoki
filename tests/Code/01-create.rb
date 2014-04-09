

require './Server/Code/model'

describe "Code: create" do

  before do
    Code::TABLE.delete
    @sn = Screen_Name_Test.screen_name(1)
  end

  it "creates a record with :screen_name_id == id of owner" do
    r = Code.create @sn, "on view profile", :is_on, "[]"
    raw = Code::TABLE.where(id: r.id).all
    raw.last[:screen_name_id].should == @sn.id
  end

  it "raises Invalid if screen_name_id, event_name_id already exists" do
    lambda {
      Code.create @sn, "on view profile", :is_on, "[]"
      Code.create @sn, "on view profile", :is_on, "[]"
    }.should.raise(Code::Invalid).
    message.
    should.match(/Code already exists for:/)
  end

  it "escapes :code" do
    code = '["a", ["\""]]'
    r = Code.create @sn, "on view profile", :is_on, '["a", ["\""]]'
    raw = Code::TABLE.where(:id=>r.id).first
    raw[:code].should == MultiJson.dump(Okdoki::Escape_All.escape MultiJson.load(code))
  end

end # === describe Code: create ===


