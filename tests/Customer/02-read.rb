
require './tests/helpers'
require './Server/Customer/model'

include Customer::Test

describe 'read_by_id:' do

  it 'reads Customer from DB using customer id' do
    o  = create
    id = o[:c].data[:id]
    c  = Customer.read_by_id(id)

    assert :==, id, c.data[:id]
  end

  it 'fills up screen name list' do
    o  = create
    sn = o[:sn].upcase
    c  = Customer.read_by_id(o[:c].data[:id])

    assert :==, [sn], c.screen_names.names
  end

  it 'raises Customer::Not_Found' do
    lambda {
      c= Customer.read_by_id(0)
      puts c.data
    }.should.raise(Customer::Not_Found).
    message.
    should.match /Customer not found/
  end

end # === describe read_by_id ===


describe 'read_by_screen_name' do

  it 'reads customer if passed screen-name as string' do
    c = Customer.read_by_screen_name(screen_name)
    assert :equal, customer_id, c.data[:id]
  end

  it 'reads customer if passed a hash with: screen_name' do
    c = Customer.read_by_screen_name(:screen_name => screen_name)
    assert :equal, customer_id, c.data[:id]
  end

  it 'reads customer if passed a hash with: screen_name, correct pass_phrase' do
    c = Customer.read_by_screen_name(screen_name: screen_name, pass_phrase: pass_phrase)
    assert :equal, customer_id, c.data[:id]
  end

  it 'does not read customer if passed a hash with: screen_name, incorrect pass_phrase' do
    lambda {
      Customer.read_by_screen_name screen_name: screen_name, pass_phrase: 'no pass phrase'
    }.should.raise.
    message.should.
    match 'Pass phrase is incorrect. Check your CAPS LOCK key.'
  end

  it 'increases bad_log_in_count by one if incorrect pass_phrase supplied' do
      Customer::TABLE.
        where(:id=>customer.data[:id]).
        update(bad_log_in_count: 3)

      Customer.read_by_screen_name screen_name: screen_name, pass_phrase: 'no pass phrase'

      c = Customer::TABLE[id: customer.data[:id]]
      assert :equal, 4, c.bad_log_in_count
  end

  it 'updates log_in_at to PG current_date when logging in' do
    d = Customer::TABLE["SELECT current_date AS date"][:date]

    # ensure old date for log_in_at
    Customer::TABLE["UPDATE @table SET log_in_at = '1999-01-01';"]

    last = Customer.read_by_screen_name screen_name: screen_name, pass_phrase: pass_phrase
    assert :equal, d.to_i, last.data.log_in_at.to_i
  end

  it 'returns invalid if: correct pass phrase, too many bad log-ins' do
    now = Sequel.lit("timezone('UTC'::text, now()")
    # reset log in col vals
    Customer::TABLE.where(id: customer.data[:id]).update(log_in_at: now, bad_log_in_count: 4)

    lambda {
      Customer.read_by_screen_name screen_name: screen_name, pass_phrase: pass_phrase
    }.should.raise( Customer::Invalid ).
      message.should.match "Too many bad log-ins for today. Try again tomorrow."
  end

  it 'sets log_in_at to current date' do
    o    = read_by_screen_name sn
    date = DB["SELECT current_date as date;"].first[:date]
    assert :==, date, o[:c].data[:log_in_at]
  end
end # === describe read_by_screen_name




