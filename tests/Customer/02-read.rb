
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

Customer::Log_In_By_IP::TABLE.delete

describe 'read_by_screen_name_and_pass_word' do

  before do
    Customer::TABLE.
      update(bad_log_in_count: 0)
    Customer::Log_In_By_IP::TABLE.
      where(ip: IP).
      update(bad_log_in_count: 0)
  end

  it 'reads customer if passed a hash with: screen_name, correct pass_word' do
    c = Customer.read_by_screen_name_and_pass_word(OC[:sn], OC[:pw], IP)
    assert :==, C.data[:id], c.data[:id]
  end

  it 'raises Customer::Wrong_Pass_Word if passed a hash with: screen_name, incorrect pass_phrase' do
    lambda {
      Customer.read_by_screen_name_and_pass_word OC[:sn], 'no pass phrase', IP
    }.should.raise(Customer::Wrong_Pass_Word).
    message.should.
    match(/Pass phrase is incorrect. Check your CAPS LOCK key/)
  end

  it 'increases :bad_log_in_count by 1 if incorrect pass_phrase supplied' do
    Customer::TABLE.
      where(:id=>C.data[:id]).
      update(bad_log_in_count: 3)

    begin
      Customer.read_by_screen_name_and_pass_word OC[:sn], 'no pass phrase', IP
    rescue Customer::Wrong_Pass_Word
    end

    c = Customer::TABLE[id: C.data[:id]]
    assert :==, 4, c[:bad_log_in_count]
  end

  it 'increases IP :bad_log_in_count by 1 if incorrect pass word, correct screen name supplied' do
    begin
      Customer.read_by_screen_name_and_pass_word OC[:sn], "incorrect", IP
    rescue Customer::Wrong_Pass_Word
    end
    r = Customer::Log_In_By_IP::TABLE[ip: IP]
    assert :==, 1, r[:bad_log_in_count]
  end

  it 'increases IP :bad_log_in_count by 1 if incorrect pass word, unknown screen name supplied' do
    begin
      Customer.read_by_screen_name_and_pass_word "uknown sn", "incorrect", IP
    rescue Screen_Name::Not_Found
    end
    r = Customer::Log_In_By_IP::TABLE[ip: IP]
    assert :==, 1, r[:bad_log_in_count]
  end

  it 'updates log_in_at to PG current_date when logging in' do
    d = DB["SELECT current_date AS date"].first[:date]

    # ensure old date for log_in_at
    Customer::TABLE.update(:log_in_at => '1999-01-01')

    last = Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw], IP

    assert :==, d.to_s, last.data[:log_in_at].to_s
  end

  it 'updates log_in_at of IP TABLE to PG current_date when logging in' do
    d = DB["SELECT current_date AS date"].first[:date]

    # ensure ip entry exists
    Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw], IP

    # ensure old date in IP TABLE
    Customer::Log_In_By_IP::TABLE.update(:log_in_at => '1999-01-01')

    # Log in again.
    Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw], IP

    assert :==, d.to_s, Customer::Log_In_By_IP::TABLE.where(ip: IP).first[:log_in_at].to_s
  end

  it 'returns Too_Many_Bad_Logins if: correct pass phrase, too many bad log-ins' do
    Customer::TABLE.
      where(id: C.data[:id]).
      update(log_in_at: Ok::Model::PG::UTC_NOW, bad_log_in_count: 4)

    lambda {
      Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw], IP
    }.should.raise( Customer::Too_Many_Bad_Logins ).
      message.
      should.match(/Too many bad log-ins for today. Try again tomorrow/)
  end

  it 'returns Too_Many_Bad_Logins if: correct pass phrase, no bad log ins by screen name, ' +
    ' too many bad log-ins by IP' do
    Customer::Log_In_By_IP::TABLE.
      where(ip: IP).
      update(log_in_at: Ok::Model::PG::UTC_NOW, bad_log_in_count: 4)

    lambda {
      Customer.read_by_screen_name_and_pass_word OC[:sn], OC[:pw], IP
    }.should.raise( Customer::Too_Many_Bad_Logins ).
      message.
      should.match(/Too many bad log-ins for today. Try again tomorrow/)
  end

end # === describe :read_by_screen_name_and_pass_word

describe "Customer :screen_names" do

  it "gets latest ids after multiple :create :screen_name, NAME" do
    o = create
    c = o[:c]
    names = [o[:sn].upcase]
    4.times do |i|
      n = new_name
      names << n.upcase
      c.create :screen_name, n
    end

    ids = Screen_Name::TABLE.select(:id).where(screen_name: names).map { |r| r[:id] }
    assert :equal, ids, c.screen_names.ids
  end

  it "gets latest names after multiple :create :screen_name, NAME" do
    o = create
    c = o[:c]
    names = [o[:sn].upcase]
    4.times do |i|
      n = new_name
      names << n.upcase
      c.create :screen_name, n
    end

    assert :equal, names, c.screen_names.names
  end

end # === describe Customer :screen_names ===


