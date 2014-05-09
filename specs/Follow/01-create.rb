
require './Server/Follow/model'

include Screen_Name_Test

describe "Follow: create" do

  before do
    @sn1 = Screen_Name_Test.screen_name 0
    @sn2 = Screen_Name_Test.screen_name 1
  end

  it "sets :pub_class_id when passed a Screen_Name" do
    Follow.create @sn2, @sn1

    rec = Follow::TABLE[:pub_class_id => 1, :pub_id=>@sn1.id, :follower_id=>@sn2.id]

    rec[:pub_class_id].should == 1
  end

  it "raises ignores duplicates" do
    lambda {
      Follow.create @sn2, @sn1
      Follow.create @sn2, @sn1
    }.should.not.raise

    records = Follow::TABLE.where(:pub_class_id => 1, :pub_id=>@sn1.id, :follower_id=>@sn2.id).all

    records.size.should == 1

    rec = records.first
    rec[:pub_class_id].should == 1
    rec[:pub_id].should      == @sn1.id
    rec[:follower_id].should == @sn2.id
  end

end # === describe Follow: create ===


