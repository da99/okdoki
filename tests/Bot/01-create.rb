
require './tests/helpers'
require './Server/Bot/model'

include Customer::Test

OC = create
C  = OC[:c]
ID = C.data[:id]

describe "Customer :bots :create" do

  before do
    Bot::TABLE.delete
  end

  it "sets owner_id to Customer id" do
    bot = C.bots.create
    assert :==, ID, bot.data[:owner_id]
  end

  it "sets owner_type to 0" do
    bot = Bot.create C
    assert :==, 0, bot.data[:owner_type]
  end

end # === describe Bot: create ===


