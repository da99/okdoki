

require './Server/Computer/model'
require './Server/Screen_Name/specs/helpers'
require './Server/Computer/specs/helpers'

describe "Computer: create" do

  before do
    Computer_Test.delete
    @sn = Screen_Name_Test.list(0)
  end

  it "escapes :code" do
    code = '["a", ["\""]]'
    r = Computer.create @sn, "read-screen-name", '["a", ["\""]]'
    raw = Computer::TABLE.where(:id=>r.id).first
    raw[:code].should == MultiJson.dump(Okdoki::Escape_All.escape MultiJson.load(code))
  end

end # === describe Code: create ===


