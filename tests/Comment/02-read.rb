
require './tests/helpers'
require './Server/Comment/model'

describe "Comment: read" do

  before do
    @sn1 = Screen_Name_Test.screen_name 0
    id   = rand(1000)
    @cc1 = Chit_Chat.new(:id=>id, :body=>"msg #{id}")
  end

  it "grabs comments in reverse :created_at order" do
    c1 = Comment.create @sn1, @cc1, "msg 1"
    c2 = Comment.create @sn1, @cc1, "msg 2"
    c3 = Comment.create @sn1, @cc1, "msg 3"

    comments = Comment.read @cc1
    comments.map(&:id).should == [c3.id, c2.id, c1.id]
  end

end # === describe Comment: read ===


