
require './tests/helpers'
require './Server/Chit_Chat/model'

include Screen_Name::Test

def days_ago days
  Sequel.lit(Ok::Model::PG::UTC_NOW_RAW + " - interval '#{days * 24} hours'")
end

def update_last_read_at sn, days
  Chit_Chat::TABLE_LAST_READ.
    where(sn_id: sn.id).
    update(last_read_at: days_ago(days))
end

def update_created_at msg, days
  Chit_Chat::TABLE.
    where(id: msg.id).
    update(created_at: days_ago(days))
end

4.times do |i|
  o = create
  s = o[:sn]
  Object.const_set :"O#{i+1}", o
  Object.const_set :"S#{i+1}", s
end

describe "Chit_Chat: read_inbox" do

  before do
    Chit_Chat::TABLE.delete
    Chit_Chat::TABLE_TO.delete
    Chit_Chat::TABLE_LAST_READ.delete
    I_Know_Them::TABLE.delete
  end

  it "grabs an array of Chit_Chats from people they follow" do
    S1.create :i_know_them, S2
    S1.create :i_know_them, S3
    S2.create :chit_chat, "msg 1"
    S3.create :chit_chat, "msg 2"

    list = S1.read :chit_chat_inbox

    assert :==, ["msg 1", "msg 2"], list.map(&:body)
  end

  it "does not grab from people they don't follow" do
    S1.create :i_know_them, S2
    S1.create :i_know_them, S3
    S2.create :chit_chat, "msg 1"
    S3.create :chit_chat, "msg 2"
    S4.create :chit_chat, "msg 3"

    list = S1.read :chit_chat_inbox

    assert :==, ["msg 1", "msg 2"], list.map(&:body)
  end

end # === describe Chit_Chat: read ===


