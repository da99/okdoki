
require './tests/helpers'
require './Server/Screen_Name_Code/model'

include Screen_Name::Test

O = create
S = O[:sn]
B = S.create :bot
C = []
C << B.create(:code, target: 'settings', code: [])
C << B.create(:code, target: 'custom',   code: [])

describe "Screen_Name_Code: read_by_bot" do

  it "returns an Array of Screen_Name_Code" do
    arr = Screen_Name_Code.read_all_for_bot(B)
    arr.each { |b|
      assert :==, Screen_Name_Code, b.class
    }
  end

  it "returns bots with :bot_id set to bot.id" do
    arr = Screen_Name_Code.read_all_for_bot(B)
    arr.each { |b|
      assert :==, B.id, b.bot_id
    }
  end

end # === describe Screen_Name_Code: read ===


