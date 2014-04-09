
require './Server/Consume/model'

include Screen_Name_Test

describe "Consume: create" do

  before do
    Consume::TABLE.delete
    @producer = Screen_Name_Test.owner(1)[:sn]
    @consumer = Screen_Name_Test.owner(2)[:sn]
  end

  it "creates a record with: :producer_id" do
    Consume.create @producer, @consumer
    raw = Consume::TABLE.
      where(:producer_id=>@producer.id, :consumer_id=>@consumer.id).
      first
    raw[:producer_id].should == @producer.id
  end

  it "creates a record with: :consumer_id" do
    Consume.create @producer, @consumer
    raw = Consume::TABLE.
      where(:producer_id=>@producer.id, :consumer_id=>@consumer.id).
      first
    raw[:consumer_id].should == @consumer.id
  end

  it "raises Invalid if row already exists" do
    lambda {
      Consume.create @producer, @consumer
      Consume.create @producer, @consumer
    }.
    should.
    raise(Consume::Invalid).

    message.
    should.
    match /Subscription already exists: #{@consumer.screen_name} -> #{@producer.screen_name}/
  end

end # === describe Consume: create ===


