
require './tests/helpers'
require './tests/helpers/Follow'
require './tests/helpers/Chit_Chat'
require './Server/Chit_Chat/model'

include Follow_Test
include Chit_Chat_Test

def pluck arr, key
  arr.map { |a| a[key] }
end

describe "Chit_Chat: read_inbox" do

  before do
    delete_all_chit_chats
    delete_all_follows

    @sn1 = Chit_Chat_Test::Screen_Name_1
    @sn2 = Chit_Chat_Test::Screen_Name_2
    @sn3 = Chit_Chat_Test::Screen_Name_3

    @sn1.update_privacy :world
    @sn2.update_privacy :world
    @sn3.update_privacy :world
  end

  it "grabs an array of Chit_Chats from people they follow" do
    create_follow @sn2, @sn1
    create_follow @sn3, @sn1
    create_chit_chat @sn2, "msg 1"
    create_chit_chat @sn3, "msg 2"

    list = Chit_Chat.read_inbox @sn1

    pluck(list, :count_new)
    .should == [1, 1]
  end

  it "does not grab from people they don't follow" do
    create_follow @sn2, @sn1

    create_chit_chat @sn2, "msg 1"
    create_chit_chat @sn3, "msg 2"

    list = Chit_Chat.read_inbox @sn1

    pluck(list, :count_new)
    .should == [1]
  end

  it "grabs follows in reverse :created_at" do
    create_follow @sn2, @sn1
    create_follow @sn3, @sn1

    create_chit_chat @sn2, "msg 1"
    create_chit_chat @sn2, "msg 2"
    create_chit_chat @sn3, "msg 3"

    list = Chit_Chat.read_inbox @sn1

    pluck(list, :count_new)
    .should == [1, 2]
  end

  it "does not count older msgs than :last_read_at" do
    create_follow @sn2, @sn1
    create_follow @sn3, @sn1

    create_chit_chat @sn2, "msg 1 day", 1
    create_chit_chat @sn3, "msg 2 day", 2

    create_chit_chat @sn2, "msg 1"
    create_chit_chat @sn2, "msg 2"
    create_chit_chat @sn3, "msg 3"
    create_chit_chat @sn3, "msg 4"

    list = Chit_Chat.read_inbox @sn1

    pluck(list, :count_new)
    .should == [2, 2]
  end

end # === describe Chit_Chat: read ===


