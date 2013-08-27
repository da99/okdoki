
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

  it "sets :body" do
    b = new_body
    cc = Chit_Chat.create S1, b
    assert :==, b, cc.body
  end

  it "raises Chit_Chat::Invalid if body is greater than 1000 chars" do
    lambda {
      b = new_body
      Chit_Chat.create S1, ("0123456789" * 101)
    }.should.raise(Chit_Chat::Invalid)
    .msg.should.match(/Too many characters: 10 over the limit/)
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




















