
require './tests/helpers'
require './Server/Bot_Use/model'

include Screen_Name::Test

O1 = create
S1 = O1[:sn]
B1 = S1.create :bot

O2 = create
S2 = O2[:sn]
U  = Bot_Use.create S2, B1

describe "Bot_Use: create" do

  it "creates a record with: sn_id = sn.id" do
    assert :==, S2.id, U.data[:sn_id]
  end

  it "creates a record with: sn_type = 0" do
    assert 0, U.data[:sn_type]
  end

  it "creates a record with: bot_id = bot.id" do
    assert :==, B1.id, U.data[:bot_id]
  end

end # === describe Bot_Use: create ===


