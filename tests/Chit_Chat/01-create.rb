
require './tests/helpers'
require './Server/Chit_Chat/model'

include Screen_Name_Test

describe "Chit_Chat:" do

  before do
    @s1 = Screen_Name_Test.owner(0)[:sn]
    @s2 = Screen_Name_Test.owner(1)[:sn]

    @body = new_body
  end

  describe "Chit_Chat: :create sn, body" do

    it "sets :from_id to sn.id" do
      cc = Chit_Chat.create @s1, new_body

      assert :==, @s1.id, cc.from_id
    end

    it "sets :body" do
      cc = Chit_Chat.create @s1, @body

      assert :==, @body, cc.body
    end

    it "raises Chit_Chat::Invalid if body is greater than 1000 chars" do
      lambda {
        Chit_Chat.create @s1, ("0123456789" * 101)
      }.should.raise(Chit_Chat::Invalid)
      .msg.should.match(/Too many characters: 10 over the limit/)
    end

  end # === describe Chit_Chat: create ===


  describe "Chit_Chat :create w/:to" do

    it "creates a chit_chat_to record for each to_id" do
      cc = Chit_Chat.create @s1, {body: @body, to: [@s1.name, @s2.name]}
      rows = Chit_Chat::TABLE_TO.where(chit_chat_id: cc.id).all
      assert :==, 2, rows.size
      assert :==, @s1.id, rows[0][:to_id]
      assert :==, @s2.id, rows[1][:to_id]
    end

  end # === describe Chit_Chat :create w/:to ===


end # === describe Chit_Chat ===




















