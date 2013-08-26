
require './tests/helpers'

include Screen_Name::Test

O  = create
O[:sn].create :bot
S  = Screen_Name.read_by_id O[:sn].data[:id]

describe "Screen Name :bot" do

  before do
    @s = S
  end

  it "returns a bot instance" do
    assert :==, Bot, @s.bot.class
  end

  it "returns a bot instance with :sn_id = data[:id], :sn_type = 0" do
    assert :==, Bot, @s.bot.class
  end

end # === describe
