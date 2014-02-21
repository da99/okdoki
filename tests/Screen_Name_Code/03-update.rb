
require './tests/helpers'
require './Server/Screen_Name_Code/model'

describe "Screen_Name_Code: update" do

  before do
    @sn = Screen_Name_Test.screen_name(1)
    Screen_Name_Code::TABLE.delete
  end

  it "updates record in database" do
    str = MultiJson.dump(['a', []])
    r = Screen_Name_Code.create @sn, "on view profile", "[]"
    r.update :code=> str
    Screen_Name_Code::TABLE.where(id: r.id).first[:code].
      should == str
  end

  it "escapes :code" do
    r = Screen_Name_Code.create @sn, "on view profile", "[]"

    code = ['a', ["\""]]
    r.update :code=> MultiJson.dump(code)

    Screen_Name_Code::TABLE.where(id: r.id).first[:code].
      should == MultiJson.dump(Okdoki::Escape_All.escape code)
  end

end # === describe Screen_Name_Code: update ===


