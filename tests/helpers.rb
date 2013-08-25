
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
      @i ||= Screen_Name::TABLE.count
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
        password: "this is a pass",
        confirm_password: "this is a pass",
        ip: '000.00.000'
      {c: c, sn: sn, pw: "this is a pass"}
    end

  end # === module Test ===

end # === class Customer ===

def assert action, *args, &blok
  case action
  when :zero
    Should.new(args.shift).be.equal 0
  when :one
    Should.new(args.shift).be.equal 1
  when Proc
    Should.new(args.shift).be args.shift
  else
    expect = args.shift
    actual = args.shift
    Should.new(actual).be.send(action, expect, *args, &blok)
  end
end

def assert_not action, *args, &blok
  case action
  when :zero
    Should.new(args.shift).be.not.equal 0
  when :one
    Should.new(args.shift).be.not.equal 1
  when Proc
    Should.new(args.shift).not.be args.shift
  else
    expect = args.shift
    actual = args.shift
    Should.new(actual).be.not.send(action, expect, *args, &blok)
  end
end














































