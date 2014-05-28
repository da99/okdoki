
require './Server/Computer/model'

describe "Computer: as-comment-create" do

  before do
    @sn1 = Screen_Name_Test.screen_name 0
    @sn2 = Screen_Name_Test.screen_name 1
    @cc1 = create_chit_chat @sn1, "msg #{Time.now.to_i}"
  end

  it "sets :pub_class_id = #{Comment::Chit_Chat_Class_Id} when Chit_Chat passed to it" do
    comment = Comment.create @sn2, @cc1, "msg 1"
    row     = Comment::TABLE[:id=>comment.id]

    row[:pub_class_id].should == Comment::Chit_Chat_Class_Id
  end

  it "raises Comment::Limit_Reached if more than #{Comment::Create_Limit} comments are created" do
    lambda {
      (Comment::Create_Limit + 1).times do |i|
        Comment.create @sn2, @cc1, "msg #{i}"
      end
    }.should.raise(Comment::Limit_Reached)
    .msg.should.match(/Comment limit reached. No more comments can be created./)
  end

end # === describe Computer: as-comment-create ===


