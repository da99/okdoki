
class Screen_Name

  class << self

    def read_by_id id
      Screen_Name.new TABLE.limit(1)[:id=>id], "Screen name not found."
    end

    def read_by_screen_name raw_sn
      r = TABLE.limit(1)[:screen_name=>Screen_Name.canonize(raw_sn)]
      new r, "Screen name not found: #{raw_sn}"
    end

  end # === class self ===

end # === class Screen_Name read ===





