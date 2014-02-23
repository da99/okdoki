
require './tests/helpers'
require './Server/Screen_Name_Code_Consume/model'

include Screen_Name::Test

O1 = create
S1 = O1[:sn]
B1 = S1.create :bot

O2 = create
S2 = O2[:sn]
U  = Screen_Name_Code_Consume.create S2, B1

describe "Screen_Name_Code_Consume: create" do

  it "creates a record with: sn_id = sn.id" do
    assert :==, S2.id, U.data[:sn_id]
  end

  it "creates a record with: bot_id = bot.id" do
    assert :==, B1.id, U.data[:bot_id]
  end

end # === describe Screen_Name_Code_Consume: create ===


