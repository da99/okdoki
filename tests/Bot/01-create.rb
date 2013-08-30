
require './tests/helpers'
require './Server/Bot/model'

include Screen_Name::Test

O = create
S = O[:sn]

describe "Bot :create" do

  before do
    # Bot::TABLE.delete
  end

  it "raises Bot::Invalid if bot already created with dup :sn_id " do
    Bot.create S
    lambda {
      Bot.create S
    }.should.raise(Bot::Invalid)
    .msg.should.
      match /Bot already exists for: #{S.name}/
  end

end # === describe Bot :create ===

