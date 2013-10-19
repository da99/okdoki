
require './Server/Customer/model'

module Screen_Name_Test

  def new_name
    @i ||= begin
             r = Screen_Name::TABLE.order(:id).last
             r ||= {:screen_name=>'0_0', :id=>0}
             r[:screen_name].split('_').last.to_i + r[:id]
           end
    @i += 1
    "ted_#{@i}"
  end

  def create_screen_name customer = nil
    name = new_name
    c = customer || Customer.new(data: 0)
    sn = Screen_Name.create(:screen_name=>name, :customer=>c)
    {name: name, c: c, sn: sn, id: sn.data[:id]}
  end

  def read_screen_name_record o
    Screen_Name::TABLE[id: o[:sn].data[:id]]
  end

  def update_screen_name_privacy sn, sym
    sn.update_privacy sym
  end

  class << self

    include Screen_Name_Test

    def init
      @owners  = []
      @screen_names = []

      4.times do |i|
        @owners << create_screen_name
        @screen_names << @owners.last[:sn]
      end
    end

    def owner n
      @owners[n]
    end

    def screen_name n
      @screen_names[n]
    end

  end # === class self

end # === module Screen_Name_Test ===


Screen_Name_Test.init


