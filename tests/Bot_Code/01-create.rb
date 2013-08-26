
require './tests/helpers'
require './Server/Bot_Code/model'

include Screen_Name::Test

O = create
S = O[:sn]
B = S.create :bot
C = Bot_Code.create B, target: 'custom', code: ['hello', []]

describe "Bot_Code: create" do

  it "raises an error if bot.id is null" do
    lambda {
      Bot_Code.create Bot.new({}), target: 'custom', code: ['hello', []]
    }.should.raise(PG::NotNullViolation).
      message.should.match(/null value in column "bot_id"/)
  end

  it "raises Bot_Code::Invalid if is dup: bot_id, target" do
    s = create[:sn]
    b = s.create :bot
    c = b.create target: 'settings', code: []
    lambda {
      b.create target: 'settings', code: []
    }.should.raise(Bot_Code::Invalid).
    message.should.match(/Bot code already exists for: #{s.name} settings/)
  end

  it "does not raise Bot_Code::Invalid if dup: bot_id, target = custom" do
    s = create[:sn]
    b = s.create :bot
    c = b.create target: 'custom', code: []
    lambda {
      b.create target: 'custom', code: []
    }.should.not.raise
  end

  it "sets :bot_id to :id of bot passed" do
    assert :==, B.id, C.bot_id
  end

end # === describe Bot_Code: create ===


