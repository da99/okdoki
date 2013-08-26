
require './tests/helpers'

include Screen_Name::Test

O = create
S = O[:sn]
S.create :bot
B = Bot.read_by_screen_name(S)

describe "Bot.read_by_screen_name" do

  before do
    @s = S
    @b = B
  end

  it "raises Bot::Not_Found if screen name has no bot" do
    s = create[:sn]
    lambda {
      Bot.read_by_screen_name s
    }.should.raise(Bot::Not_Found)
    .message.should.match(/Bot not found for: #{s.name}/)
  end

  it "returns a bot instance" do
    assert :==, Bot, @b.class
  end

  it "returns a bot instance with :sn_id = data[:id]" do
    assert :==, @s.data[:id], @b.data[:sn_id]
  end

  it "returns a bot instance with :sn_type = 0" do
    assert 0, @b.data[:sn_type]
  end

end # === describe



