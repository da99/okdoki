
require './tests/helpers'
require './Server/Comment/model'

describe "Comment: create" do

  before do
    @sn1 = Screen_Name_Test.screen_name 0
    @cc1 = Chit_Chat.new(:id=>1000, :body=>"#{rand(1000)}")
  end

  it "sets :pub_type_id = #{Comment::Chit_Chat_Type_Id} when Chit_Chat passed to it" do
    comment = Comment.create @sn1, @cc1, "msg 1"
    row     = Comment::TABLE[:id=>comment.id]

    row[:pub_type_id].should == Comment::Chit_Chat_Type_Id
  end

end # === describe Comment: create ===


