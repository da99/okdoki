
require './tests/helpers'
require './Server/Chit_Chat/model'

include Customer::Test

O = create
C = o[:c]

N1 = new_name
C.create :screen_name, N1

N2 = new_name
C.create :screen_name, N2

N3 = new_name
C.create :screen_name, N3

describe "Chit_Chat.update_read Customer" do

  it "upserts :last_read for all screen name ids" do
    Chit_Chat.update_last_read C
    rows = Chit_Chat.last_read_for(C)
    ids = rows.map { |i| i[:sn_id] }.sort
    assert :equal, C.screen_names.ids.sort, ids
  end

  it "sets :last_read for UTC now" do
    Chit_Chat.update_last_read C
    rows = Chit_Chat.last_read_for(C)
    dates = rows.map { |i| i[:last_read_at] }.uniq

    assert 1, dates.size
    assert within_secs(3), dates.first
  end

end # === describe Chit_Chat: update ===


