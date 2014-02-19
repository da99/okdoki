
class Screen_Name_Code

  class << self

    def read_all_for_bot bot
      Screen_Name_Code.new(TABLE.where(bot_id: bot.id).all)
    end

    def read_by_screen_name_id_and_event_name_id id, raw_event_name_id
      event_name_id = validate_event_name(raw_event_name_id)
      new TABLE.limit(1)[:screen_name_id=>id, :event_name_id=>event_name_id]
    end

  end # === class self ===

  def code
    data[:code]
  end

end # === class Screen_Name_Code read ===





