
require './tests/helpers'
require './Server/Screen_Name_Code_Consume/model'

include Screen_Name_Test

describe "Screen_Name_Code_Consume: create" do

  before do
    Screen_Name_Code_Consume::TABLE.delete
    @producer = Screen_Name_Test.owner(1)[:sn]
    @consumer = Screen_Name_Test.owner(2)[:sn]
  end

  it "creates a record with: :producer_id" do
    Screen_Name_Code_Consume.create @producer, @consumer
    raw = Screen_Name_Code_Consume::TABLE.
      where(:producer_id=>@producer.id, :consumer_id=>@consumer.id).
      first
    raw[:producer_id].should == @producer.id
  end

  it "creates a record with: :consumer_id" do
    Screen_Name_Code_Consume.create @producer, @consumer
    raw = Screen_Name_Code_Consume::TABLE.
      where(:producer_id=>@producer.id, :consumer_id=>@consumer.id).
      all
    raw[:consumer_id].should == @consumer.id
  end

  it "raises Invalid if row already exists" do
    lambda {
      Screen_Name_Code_Consume.create @producer, @consumer
      Screen_Name_Code_Consume.create @producer, @consumer
    }.
    should.
    raise(Screen_Name_Code_Consume::Invalid).

    message.
    should.
    match /Subscription already exists: #{@consumer.screen_name} -> #{@producer.screen_name}/
  end

end # === describe Screen_Name_Code_Consume: create ===


