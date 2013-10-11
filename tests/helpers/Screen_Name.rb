
require './Server/Customer/model'

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

