
require './tests/helpers'
require './Server/Chit_Chat/model'

include Screen_Name::Test

def days_ago days
  Sequel.lit(Ok::Model::PG::UTC_NOW_RAW + " - interval '#{days * 24} hours'")
end

def update_last_read_at sn, days
  rows = Chit_Chat::TABLE_LAST_READ.
    returning.
    where(sn_id: sn.id).
    update(last_read_at: days_ago(days))
  if rows.empty?
    Chit_Chat::TABLE_LAST_READ.
      returning.
      insert(sn_id: sn.id, last_read_at: days_ago(days))
  end
end

def update_created_at msg, days
  Chit_Chat::TABLE.
    where(id: msg.id).
    update(created_at: days_ago(days))
  Chit_Chat::TABLE_TO.
    where(chit_chat_id: msg.id).
    update(created_at: days_ago(days))
end

5.times do |i|
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

    S1.create :i_know_them, S2
    S1.create :i_know_them, S3
  end

  it "grabs an array of Chit_Chats from people they follow" do
    S2.create :chit_chat, "msg 1"
    S3.create :chit_chat, "msg 2"

    list = S1.read :chit_chat_inbox

    assert :==, ["msg 1", "msg 2"], list.map(&:body).sort
  end

  it "does not grab from people they don't follow" do
    S2.create :chit_chat, "msg 1"
    S3.create :chit_chat, "msg 2"
    S4.create :chit_chat, "msg 3"

    list = S1.read :chit_chat_inbox

    assert :==, ["msg 1", "msg 2"], list.map(&:body).sort
  end

  it "grabs msgs in reverse :created_at" do
    S2.create :chit_chat, "msg 1"
    S3.create :chit_chat, "msg 2"
    S4.create :chit_chat, "msg 3"

    list = S1.read :chit_chat_inbox

    assert :==, ["msg 2", "msg 1"], list.map(&:body)
  end

  it "grabs only the latest message from each author" do
    S2.create :chit_chat, "msg 1"
    S2.create :chit_chat, "msg 2"

    S3.create :chit_chat, "msg 3"
    S3.create :chit_chat, "msg 4"

    S4.create :chit_chat, "msg 5"
    S5.create :chit_chat, "msg 6"

    list = S1.read :chit_chat_inbox

    assert :==, ["msg 4", "msg 2"], list.map(&:body)
  end

  it "grabs a count of other messages waiting to be read" do
    S2.create :chit_chat, "msg 1"
    S2.create :chit_chat, "msg 2"
    S2.create :chit_chat, "msg 3"

    S3.create :chit_chat, "msg 4"
    S3.create :chit_chat, "msg 5"

    S4.create :chit_chat, "msg 6"
    S5.create :chit_chat, "msg 7"

    list = S1.read :chit_chat_inbox

    assert :==, [1, 2], list.map(&:cc_count)
  end

  it "does not read messages older than :last_read_at" do
    update_created_at(S2.create(:chit_chat, "msg 1"), 2)
    update_created_at(S2.create(:chit_chat, "msg 2"), 2)
    S2.create :chit_chat, "msg 3"

    update_created_at(S3.create(:chit_chat, "msg 4"), 2)
    update_created_at(S3.create(:chit_chat, "msg 5"), 2)

    update_created_at(S4.create(:chit_chat, "msg 6"), 2)
    S5.create :chit_chat, "msg 7"

    update_last_read_at S1, 1
    list = S1.read :chit_chat_inbox

    assert :==, ["msg 3"], list.map(&:body)
  end

  it "does not count older msgs than :last_read_at" do
    update_created_at(S2.create(:chit_chat, "msg 1"), 2)
    update_created_at(S2.create(:chit_chat, "msg 2"), 2)
    S2.create :chit_chat, "msg 3"

    update_created_at(S3.create(:chit_chat, "msg 4"), 2)
    S3.create(:chit_chat, "msg 5")

    update_created_at(S4.create(:chit_chat, "msg 6"), 2)
    S5.create :chit_chat, "msg 7"

    update_last_read_at S1, 1
    list = S1.read :chit_chat_inbox

    assert :==, [0, 0], list.map(&:cc_count)
  end

end # === describe Chit_Chat: read ===


