
require './Server/Consume/model'

include Screen_Name_Test

describe "Consume: create" do

  before do
    Consume::TABLE.delete
    @producer = Screen_Name_Test.owner(1)[:sn]
    @consumer = Screen_Name_Test.owner(2)[:sn]

    @sn1 = Screen_Name_Test.screen_name 0
    @sn2 = Screen_Name_Test.screen_name 1
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

  it "ignores duplicates of follows between the same consumer and publication" do
    lambda {
      Consume.create @sn2, :follows, @sn1
      Consume.create @sn2, :follows, @sn1
    }.should.not.raise

    records = Consume::TABLE.where(:pub_class_id => 1, :pub_id=>@sn1.id, :follower_id=>@sn2.id).all

    records.size.should == 1

    rec = records.first
    rec[:pub_class_id].should == 1
    rec[:pub_id].should      == @sn1.id
    rec[:follower_id].should == @sn2.id
  end

end # === describe Consume: create ===


