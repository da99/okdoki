
require './tests/helpers'
require './Server/Bot_Code/model'

include Screen_Name::Test

O = create
S = O[:sn]
B = S.create :bot
C = Bot_Code.create B, target: 'custom', code: ['<b>hello</b>', []]

describe "Bot_Code: create" do

  it "raises an error if bot.id is null" do
    lambda {
      Bot_Code.create Bot.new({}), target: 'custom', code: ['hello', []]
    }.should.raise(Sequel::NotNullConstraintViolation).
      message.should.match(/null value in column "bot_id"/)
  end

  it "raises Bot_Code::Invalid if is dup: bot_id, target" do
    s = create[:sn]
    b = s.create :bot
    c = b.create :code, target: 'settings', code: ['hello', []]
    lambda {
      b.create :code, target: 'settings', code: ['hello', []]
    }.should.raise(Bot_Code::Invalid).
    message.should.match(/Bot code already exists for: #{s.name} settings/)
  end

  it "does not raise Bot_Code::Invalid if dup: bot_id, target = custom" do
    s = create[:sn]
    b = s.create :bot
    c = b.create :code, target: 'custom', code: ['hello', []]
    lambda {
      b.create :code, target: 'custom', code: ['hello', []]
    }.should.not.raise
  end

  it "sets :bot_id to :id of bot passed" do
    assert :==, B.id, C.bot_id
  end

  it "encodes code to JSON" do
    assert :==, MultiJson.dump(Ok::Escape_All.escape ['<b>hello</b>', []]), C.code
  end

  it "HTML escapes code to JSON" do
    assert :==, MultiJson.dump(Ok::Escape_All.escape ['<b>hello</b>', []]), C.code
  end

end # === describe Bot_Code: create ===


