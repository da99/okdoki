
require './tests/helpers'
require './Server/Permission/model'

include Screen_Name_Test

describe "Permission: create" do

  before do
    @sn1 = Screen_Name_Test.screen_name 0
    @sn2 = Screen_Name_Test.screen_name 1
  end

  it "adds a record with pub_type_id = 1 for life" do
    Permission.create @sn1, @sn1, @sn2

    rows = Permission::TABLE.where(
      :from_id     => @sn1.data[:id],
      :pub_type_id => Permission::Screen_Name_Type_Id,
      :pub_id      => @sn1.data[:id],
      :to_id       => @sn2.data[:id]
    ).all

    rows.size
    .should == 1
  end

  it "ignores if record already exists." do
    Permission.create @sn1, @sn1, @sn2

    rows = Permission::TABLE.where(
      :from_id     => @sn1.data[:id],
      :pub_type_id => Permission::Screen_Name_Type_Id,
      :pub_id      => @sn1.data[:id],
      :to_id       => @sn2.data[:id]
    ).all

    rows.size
    .should == 1
  end

  it "raises an error if :to_id belongs to :from_id" do
    o  = create_screen_name
    c  = o[:c]
    sn1 = o[:sn]
    sn2 = create_screen_name(c)[:sn]
    lambda {
      Permission.create sn1, sn1, sn2
    }.should.raise(Permission::Invalid)
    .message.should.match(/Permission can't be set for same person: #{sn1.screen_name}, #{sn2.screen_name}/)
  end

end # === describe Permission: create ===


