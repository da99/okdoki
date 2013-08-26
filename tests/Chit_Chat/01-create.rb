
require './tests/helpers'
require './Server/Chit_Chat/model'

include Screen_Name::Test

O1 = create
S1 = O1[:sn]
def new_body
  @i ||= 0
  "text #{@i += 1}"
end

describe "Chit_Chat: :create sn, body" do

  it "sets :from_id to sn.id" do
    cc = Chit_Chat.create S1, new_body
    assert :==, S1.id, cc.from_id
  end

  it "sets :from_type to 0" do
    cc = Chit_Chat.create S1, new_body
    assert 0, cc.from_type
  end

  it "sets :body" do
    b = new_body
    cc = Chit_Chat.create S1, b
    assert :==, b, cc.body
  end

end # === describe Chit_Chat: create ===


describe "Chit_Chat :create w/:to" do

  it "creates a chit_chat_to record for each to_id" do
    
  end

end # === describe Chit_Chat :create w/:to ===

