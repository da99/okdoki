
class Screen_Name_Code

  class << self # =====================

    # === Helpers =====================

    def to_event_name_id name
      EVENT_NAMES.key(name) || raise(Screen_Name_Code::Invalid.new(new, "Unknown event name: #{name.inspect}"))
    end

    def to_event_name id
      EVENT_NAMES[Integer id] || raise(Screen_Name_Code::Invalid.new(new, "Unknown event name id: #{id.inspect}"))
    end

    # === READ methods ================

    def read_all_for_bot bot
      Screen_Name_Code.new(TABLE.where(bot_id: bot.id).all)
    end

    def read_by_screen_name_id_and_event_name_id id, raw_event_name_id
      event_name_id = validate_event_name(raw_event_name_id)
      new TABLE.limit(1)[:screen_name_id=>id, :event_name_id=>event_name_id]
    end

  end # === class self ================

  def id
    data[:id]
  end

  def code
    data[:code]
  end

end # === class Screen_Name_Code read ===





