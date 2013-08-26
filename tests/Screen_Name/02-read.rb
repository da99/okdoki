
require './tests/helpers'

include Screen_Name::Test

O  = create

describe "Screen Name :bot" do

  before do
    Bot::TABLE.delete
    @s = O[:sn]
  end

  it "returns a bot instance" do
    bot = @s.create :bot
    assert :==, Bot, bot.class
  end

  it "returns a bot instance with :sn_id = data[:id], :sn_type = 0" do
    bot = @s.create :bot
    assert :==, Bot, bot.class
  end

end # === describe
