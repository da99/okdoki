
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

module Customer

  module Test

    def delete_all
      Customer::TABLE.delete
      Screen_Name::TABLE.delete
    end

    def create_sample sn

      o = {
        screen_name: sn,
        pass_phrase: "this is a pass",
        confirm_pass_phrase: "this is a pass",
        ip: '000.00.000'
      }

      Customer.create o
    end

  end # === module Test ===

end # === module Customer ===



