
require './tests/helpers'
require './Server/Customer/model'

include Customer::Test

PASSWORD="this_is_my pass word"

describe 'create:' do

  it 'checks min length of screen_name' do

    lambda {
      Customer.create screen_name: new_name, password: "A", confirm_password: "A", ip: '000.00.00'
    }.should.raise(Customer::Invalid).
    message.
    should.match /Pass phrase must be: 3 or more words with spaces/

  end # === it

  it 'checks max length of screen_name' do
    screen_name = "12345678901234567890"
    lambda {
      Customer.create(
        screen_name: screen_name,
        pass_phrase: pass_phrase,
        confirm_pass_phrase: pass_phrase,
        ip: '00.000.000'
      )
    }.should.raise(Customer::Invalid).
    message.should.match /Screen name must be 4-16 valid chars:/
  end

  it 'checks pass_phrase and confirm_pass_phrase match' do
    screen_name = "123456789";
    lambda {
      Customer.new(
        screen_name: screen_name,
        pass_phrase: pass_phrase,
        confirm_pass_phrase: pass_phrase + "a",
        ip: '00.000.000'
      )
    }.should.raise(Customer::Invalid).
    message.should.match "Pass phrase is different than pass phrase confirmation."
  end

  it 'saves screen_name to Customer object' do
    o = create
    assert :==, o[:c].screen_names.names, [o[:name].upcase]
  end

  it 'saves Customer id to Customer object' do
    c = create

    # Has the customer id been saved?
    assert :is_a, c.data[:id], Numeric
  end

  it 'sets log_in_at to current date' do
    c    = create
    date = DB["SELECT current_date as date;"][:current_date]
    diff = (c.data[:log_in_at].to_i - date.to_i).abs
    assert lambda { |o| o < 2}, diff
  end

end # === desc create


