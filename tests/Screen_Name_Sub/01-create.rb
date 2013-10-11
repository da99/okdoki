
require './tests/helpers'
require './Server/Screen_Name_Sub/model'

include Screen_Name_Test

describe "Screen_Name_Sub: create" do

  before do
    @owner_1 = Screen_Name_Test.owner 1
    @sn_1    = Screen_Name_Test.screen_name 1

    @owner_2 = Screen_Name_Test.owner 2
    @sn_2    = Screen_Name_Test.screen_name 2
  end

  it "creates record if name is unique to user" do
    Screen_Name_Sub.create @sn_1, "mike"
    row = Screen_Name_Sub::TABLE[is_sub: true, owner_id: @sn_1.data[:id], screen_name: "MIKE"]
    row[:screen_name].should == 'MIKE'
  end

end # === describe Screen_Name_Sub: create ===


