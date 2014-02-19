

class Screen_Name_Code

  class << self

    def upsert sn, raw_event_name_id, code
      begin
        row = Scree_Name_Code.read_by_screen_name_id_and_event_name_id(sn.id, event_name_id)
        row.update(:code=>code)
        row
      rescue Screen_Name_Code::Not_Found
        create(:screen_name_id=>sn.id, :event_name_id=>event_name_id, :code=>code)
      end
    end

  end # === class self ===

end # === class Screen_Name_Code upsert ===



