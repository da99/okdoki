

require './Server/Code/model'

describe "Code: update" do

  before do
    @sn = Screen_Name_Test.screen_name(1)
    Code::TABLE.delete
  end

  it "updates record in database" do
    str = MultiJson.dump(['a', []])
    r = Code.create @sn, "on view profile", "[]"
    r.update :code=> str
    Code::TABLE.where(id: r.id).first[:code].
      should == str
  end

  it "escapes :code" do
    r = Code.create @sn, "on view profile", "[]"

    code = ['a', ["\""]]
    r.update :code=> MultiJson.dump(code)

    Code::TABLE.where(id: r.id).first[:code].
      should == MultiJson.dump(Okdoki::Escape_All.escape code)
  end

  it "updates its @data" do
    r = Code.create @sn, "on view profile", "[]"

    code = ['a', ["\""]]
    r.update :code=> MultiJson.dump(code)

    r.data[:code].
      should == MultiJson.dump(Okdoki::Escape_All.escape code)
  end

end # === describe Code: update ===


