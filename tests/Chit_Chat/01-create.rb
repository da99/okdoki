
require './tests/helpers'
require './Server/Chit_Chat/model'

include Screen_Name::Test

O1 = create
S1 = O1[:sn]

O2 = create
S2 = O2[:sn]

O3 = create
S3 = O3[:sn]

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
    b = new_body
    cc = Chit_Chat.create S1, {body: b, to: [S1.name, S2.name]}
    rows = Chit_Chat::TABLE_TO.where(chit_chat_id: cc.id).all
    assert :==, 2, rows.size
    assert :==, S1.id, rows[0][:to_id]
    assert :==, S2.id, rows[1][:to_id]
  end

end # === describe Chit_Chat :create w/:to ===

