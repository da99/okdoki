
require './tests/helpers'
require './Server/Follow/model'

include Screen_Name_Test

describe "Follow: create" do

  before do
    @sn1 = Screen_Name_Test.screen_name 0
    @sn2 = Screen_Name_Test.screen_name 1
  end

  it "sets :pub_type_id when passed a Screen_Name" do
    Follow.create @sn1, @sn2

    rec = Follow::TABLE[:pub_type_id => 1, :pub_id=>@sn1.id, :follower_id=>@sn2.id]

    rec[:pub_type_id].should == 1
  end

end # === describe Follow: create ===


