
require './tests/helpers'
require './Server/Chit_Chat/model'

include Screen_Name_Test

shared :chit_chat_create do
  before do
    @s1 = Screen_Name_Test.screen_name(0)
    @s2 = Screen_Name_Test.screen_name(1)

    @body = new_body
  end
end

describe "Chit_Chat: :create sn, body" do

  behaves_like :chit_chat_create

  it "sets :from_id to sn.id" do
    cc = Chit_Chat.create @s1, new_body

    cc.from_id
    .should == @s1.id
  end

  it "sets :body" do
    cc = Chit_Chat.create @s1, @body

    cc.body
    .should == @body
  end

  it "raises Chit_Chat::Invalid if body is greater than 1000 chars" do
    lambda {
      Chit_Chat.create @s1, ("0123456789" * 101)
    }.should.raise(Chit_Chat::Invalid)
    .msg.should.match(/Too many characters: 10 over the limit/)
  end

  it "deletes old chit chats if more than #{Chit_Chat::Create_Limit}" do
    (Chit_Chat::Create_Limit + 1).times do |i|
      Chit_Chat.create @s1, "msg #{i}"
    end

    DB["
      SELECT count(id) AS c
      FROM #{Chit_Chat::Table_Name}
      WHERE from_id = :fid
      ", :fid=> @s1.id
    ].first[:c].should == Chit_Chat::Create_Limit
  end

  it "sets :oldest_deleted = true when oldest chit chat have been deleted" do
    cc = nil
    (Chit_Chat::Create_Limit + 1).times do |i|
      cc = Chit_Chat.create @s1, "msg #{i}"
    end

    cc.data[:oldest_deleted].should == true
  end

end # === describe Chit_Chat: create ===























