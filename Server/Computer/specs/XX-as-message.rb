
require './Server/Computer/model'

describe "Computer: as message" do

  describe "create" do

    it "deletes old messages if message limit reached"
    it "raises Invalid if body is empty"
    it "raises Invalid if too any chars"
    it "raises Chit_Chat::Invalid if body is greater than 1000 chars" do
      lambda {
        Chit_Chat.create @s1, ("0123456789" * 101)
      }.should.raise(Chit_Chat::Invalid)
      .msg.should.match(/Too many characters: 10 over the limit/)
    end

    it "deletes oldest chit chat if more than #{Chit_Chat::Create_Limit}" do
      first_cc = nil
      (Chit_Chat::Create_Limit + 1).times do |i|
        cc = Chit_Chat.create @s1, "msg #{i}"
        first_cc ||= cc
      end

      Chit_Chat::TABLE[:id=>first_cc.id]
      .should == nil
    end

    it "sets :oldest_deleted = true when oldest chit chat have been deleted" do
      cc = nil
      (Chit_Chat::Create_Limit + 1).times do |i|
        cc = Chit_Chat.create @s1, "msg #{i}"
      end

      cc.data[:oldest_deleted].should == true
    end

    it "deletes comments from deleted old chit chats" do

      first_cc = nil
      first_comment  = nil
      (Chit_Chat::Create_Limit + 1).times do |i|
        cc = Chit_Chat.create @s1, "msg #{i}"
        if !first_cc
          first_cc = cc
          first_comment  = Comment.create @s1, first_cc, "msg 1"
        end
      end

      Comment::TABLE[:id=>first_comment.id]
      .should == nil
    end


  end # === describe create ===

end # === describe Computer: as message

