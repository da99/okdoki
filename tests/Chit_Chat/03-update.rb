
require './tests/helpers'
require './Server/Chit_Chat/model'

include Customer_Test

shared :chit_chat_update_reset do

  before do
    # old = Sequel.lit(Ok::Model::PG::UTC_NOW_RAW + " - interval '72 hours' ")
    Chit_Chat::TABLE_LAST_READ.update(:last_read_at=>nil)
  end

end

describe "Chit_Chat.update_read Customer" do

  behaves_like :chit_chat_update_reset

  it "upserts :last_read for all screen name ids" do
    Chit_Chat.update_last_read C
    rows = Chit_Chat::TABLE_LAST_READ.where(:sn_id=>C.screen_names.ids)
    assert :equal, rows.map { |r| r[:sn_id] }.sort, C.screen_names.ids.sort
  end

  it "sets :last_read for UTC now" do
    Chit_Chat.update_last_read C
    rows = Chit_Chat.last_read_for(C)
    dates = rows.map { |i| i[:last_read_at] }.uniq

    assert 1, dates.size
    assert within_secs(3), dates.first
  end


end # === describe Chit_Chat: update ===


describe "Chit_Chat.update_read Screen_Name" do

  behaves_like :chit_chat_update_reset

  it "upserts :last_read to UTC NOW for screen name" do
    Chit_Chat.update_last_read S1
    row = Chit_Chat::TABLE_LAST_READ.where(sn_id: S1.id).first
    assert within_secs(2), row[:last_read_at]
  end

  it "does not update any other :last_read_at except for specified Screen_Name" do
    old = Chit_Chat::TABLE_LAST_READ.all
    Chit_Chat.update_last_read S1
    updated = Chit_Chat::TABLE_LAST_READ.all

    assert 1, old.map { |r| r[:last_read_at].to_i }.uniq.size
    assert :==, 2, updated.map { |r| r[:last_read_at].to_i }.uniq.size
  end


end # === describe Chit_Chat: update ===






