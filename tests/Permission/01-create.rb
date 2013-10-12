
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

end # === describe Permission: create ===


