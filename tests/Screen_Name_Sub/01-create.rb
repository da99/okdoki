
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

  it "removes invalid chars" do
    Screen_Name_Sub.create @sn_1, "m k-e"
    row = Screen_Name_Sub::TABLE[is_sub: true, owner_id: @sn_1.data[:id], screen_name: "MK-E"]
    row[:screen_name].should == 'MK-E'
  end

  it "creates record if name is unique to user" do
    Screen_Name_Sub.create @sn_1, "mike"
    row = Screen_Name_Sub::TABLE[is_sub: true, owner_id: @sn_1.data[:id], screen_name: "MIKE"]
    row[:screen_name].should == 'MIKE'
  end

  it "creates record if same name, different user" do
    Screen_Name_Sub.create @sn_1, "m_2"
    Screen_Name_Sub.create @sn_2, "m_2"

    Screen_Name_Sub::TABLE[is_sub: true, owner_id: @sn_1.data[:id], screen_name: "M_2"][:screen_name]
    .should == 'M_2'

    Screen_Name_Sub::TABLE[is_sub: true, owner_id: @sn_2.data[:id], screen_name: "M_2"][:screen_name]
    .should == 'M_2'
  end

  it "raises Invalid for duplicate name for same owner" do
    name = "M-3"
    lambda {
      Screen_Name_Sub.create @sn_1, "M-3"
      Screen_Name_Sub.create @sn_1, "M-3"
    }.should.raise(Screen_Name_Sub::Invalid).
    message.should.
    match(/Screen name already created: #{name}@#{@sn_1.data[:screen_name]}/)
  end

end # === describe Screen_Name_Sub: create ===


