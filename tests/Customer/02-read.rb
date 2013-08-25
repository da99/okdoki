
require './tests/helpers'
require './Server/Customer/model'

include Customer::Test

OC = create
C  = OC[:c]

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
      Customer.read_by_id(0)
    }.should.raise(Customer::Not_Found).
    message.
    should.match(/Customer not found/)
  end

end # === describe read_by_id ===


describe 'read_by_screen_name' do

  it 'reads customer if passed screen name as string' do
    c = Customer.read_by_screen_name(OC[:sn])
    assert :==, C.data[:id], c.data[:id]
  end

end # === describe read_by_screen_name

describe 'read_by_screen_name_and_pass_word' do

  it 'reads customer if passed a hash with: screen_name, correct pass_word' do
    c = Customer.read_by_screen_name_and_pass_word(OC[:sn], OC[:pw])
    assert :==, C.data[:id], c.data[:id]
  end

  it 'raises Customer::Wrong_Pass_Word if passed a hash with: screen_name, incorrect pass_phrase' do
    lambda {
      Customer.read_by_screen_name_and_pass_word OC[:sn], 'no pass phrase'
    }.should.raise(Customer::Wrong_Pass_Word).
    message.should.
    match(/Pass phrase is incorrect. Check your CAPS LOCK key/)
  end

  it 'increases :bad_log_in_count by 1 if incorrect pass_phrase supplied' do
    Customer::TABLE.
      where(:id=>C.data[:id]).
      update(bad_log_in_count: 3)

    begin
      Customer.read_by_screen_name_and_pass_word OC[:sn], 'no pass phrase'
    rescue Customer::Wrong_Pass_Word
    end

    c = Customer::TABLE[id: C.data[:id]]
    assert :==, 4, c[:bad_log_in_count]
  end

  it 'updates log_in_at to PG current_date when logging in' do
    d = DB["SELECT current_date AS date"].first[:date]

    # ensure old date for log_in_at
    Customer::TABLE.update(:log_in_at => '1999-01-01')

    last = Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw]

    assert :==, d.to_s, last.data[:log_in_at].to_s
  end

  it 'returns Too_Many_Bad_Logins if: correct pass phrase, too many bad log-ins' do
    # reset log in col vals
    Customer::TABLE.
      where(id: C.data[:id]).
      update(log_in_at: Ok::Model::PG::UTC_NOW, bad_log_in_count: 4)

    lambda {
      Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw]
    }.should.raise( Customer::Too_Many_Bad_Logins ).
      message.
      should.match(/Too many bad log-ins for today. Try again tomorrow/)
  end

end # === describe :read_by_screen_name_and_pass_word



