

describe "Consuming a message list:" do

  before do
    delete_all Screen_Name, Customer
  end

  it "does not include messages from a life that has banned the Consumer"
  it "does not include messages if life is protected and Consumer is not allowed."

  it "does not retreive messages if consumer is banned by producer" do
    consumer = customer_create 'bob'

    producer_1 = customer_create "star_1"
    Message.create producer_1, "Prod 1"

    producer_2 = customer_create "star_2"
    Message.create producer_1, "Prod 2"
    
    Consume.create 'follow', consumer, producer_1
    Consume.create 'follow', consumer, producer_2
    Consume.create 'ban', consumer, producer_2

    list = Message.read_list 'follow', consumer
    list.map { |m| m.data.body }.should == ["Prod _1"]
  end

  it "retrieves the latest 25 messages from a consume list" do
    # === Create test data
    consumer = customer_create 'bob'
    producers = []
    msgs     = []
    3.times do |num|
      producers << customer_create "star_#{num}"
      10.times do |num|
        msgs.unshift "Hello msg #{producers.last.screen_name}: #{num}"
        Message.create producers.last, msgs.first
      end
      Consume.create 'follow',  consumer, producers.last
    end

    # === test it
    list = Message.read_list 'follow', consumer
    list.size.should            == 25
    list.first.data.body.should == msgs.first
    list.last.data.body.should  == msgs[24]
  end # === it

end # === desc
