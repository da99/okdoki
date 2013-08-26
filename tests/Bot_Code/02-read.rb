
require './tests/helpers'
require './Server/Bot_Code/model'

include Screen_Name::Test

O = create
S = O[:sn]
B = S.create :bot
C = []
C << B.create(target: 'settings', code: [])
C << B.create(target: 'custom',   code: [])

describe "Bot_Code: read_by_bot" do

  it "returns an Array of Bot_Code" do
    arr = Bot_Code.read_by_bot(B)
    arr.each { |b|
      assert :==, Bot, b.class
    }
  end

  it "returns bots with :bot_id set to bot.id" do
    arr = Bot_Code.read_by_bot(B)
    arr.each { |b|
      assert :==, B.id, b.bot_id
    }
  end

end # === describe Bot_Code: read ===


