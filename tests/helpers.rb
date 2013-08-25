
require './Server/Screen_Name/model'
require './Server/Customer/model'
require 'Bacon_Colored'

def customer
  Customer.new(:data)
end

def less_than x
  lambda { |o| o < x }
end

def within_secs x
  lambda { |o|
    o.class.should.equal Time
    !!o && (Time.now.utc.to_i - o.to_i).abs < x
  }
end

class Screen_Name
  module Test

    def new_name
      @i ||= begin
               r = Screen_Name::TABLE.order(:id).last
               (r && r[:screen_name].split('_').last.to_i) || 1
             end
      @i += 1
      "ted_#{@i}"
    end

    def create
      name = new_name
      c = Customer.new(data: 0)
      sn = Screen_Name.create(:screen_name=>name, :customer=>c)
      {name: name, c: c, sn: sn, id: sn.data[:id]}
    end

    def find_record o
      Screen_Name::TABLE[id: o[:sn].data[:id]]
    end

  end
end # === class Screen_Name ===

class Customer

  module Test

    include Screen_Name::Test

    def delete_all
      Customer::TABLE.delete
      Screen_Name::TABLE.delete
    end

    def create
      sn = new_name
      c = Customer.create screen_name: sn,
        pass_word: "this is a pass",
        confirm_pass_word: "this is a pass",
        ip: '000.00.000'
      {c: c, sn: sn, pw: "this is a pass"}
    end

  end # === module Test ===

end # === class Customer ===

def should_args action, *args
  case action
  when :zero, 0
    [ args.shift, [], :==, [0] ]
  when :one, 1
    [ args.shift, [], :==, [1] ]
  when Proc
    [ args.shift, [], nil, [action] ]
  else
    expect = args.shift
    actual = args.shift
    [ actual, [], action, args.unshift(expect) ]
  end
end

def assert *args
  make_should *should_args(*args)
end

def assert_not old_args
  args = should_args(*old_args)
  args[1].push :not
  make_should *args
end

def make_should o, bes_nots, meth, args
  s = Should.new(o)
  (bes_nots || []).each { |m|
    s = s.send(m)
  }

  if meth
    s.be.send(meth, *args)
  else
    s.be(*args)
  end
end














































