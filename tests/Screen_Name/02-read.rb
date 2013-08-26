
require './tests/helpers'

include Screen_Name::Test

O  = create
O[:sn].create :bot
S  = Screen_Name.read_by_id O[:sn].data[:id]

S2 = create[:sn]
B2 = S2.create :bot
S.create :bot_use, B2

describe "Screen_Name :bot" do

  before do
    @s = S
  end

  it "returns a bot instance" do
    assert :==, Bot, @s.bot.class
  end

  it "returns a bot instance with :sn_id = data[:id]" do
    assert :==, @s.data[:id], @s.bot.data[:sn_id]
  end

  it "returns a bot instance with :sn_type = 0" do
    assert 0, @s.bot.data[:sn_type]
  end

end # === describe

describe "Screen_Name :bot_uses" do

  it "returns an enumerable with Bots" do
    l = S.bot_uses
    l.each { |b|
      assert :==, Bot, b.class
    }
  end

end # === describe Screen_Name :bot_uses ===

