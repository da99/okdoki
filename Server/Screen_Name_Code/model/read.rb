
class Screen_Name_Code

  class << self # =====================

    # === Helpers =====================

    def to_event_name_id name
      EVENT_NAMES.key(name.to_s.strip.upcase) || raise(Screen_Name_Code::Invalid.new(new, "Unknown event name: #{name.inspect}"))
    end

    def to_event_name id
      EVENT_NAMES[Integer id] || raise(Screen_Name_Code::Invalid.new(new, "Unknown event name id: #{id.inspect}"))
    end

    def to_who_id val
      begin
        i = Integer val
        WHO_IDS[i] && i
      rescue TypeError, ArgumentError => e
        WHO_IDS.key(val) || raise("Invalid who_id value: #{val.inspect}")
      end
    end

    # === READ methods ================

    def read_all_for_bot bot
      Screen_Name_Code.new(TABLE.where(bot_id: bot.id).all)
    end

    def read_by_screen_name_id_and_event_name_id id, raw_event_name_id
      new TABLE.
        where(:screen_name_id=>id, :event_name_id=>raw_event_name_id).
        limit(1).
        first
    end

  end # === class self ================

  def id
    data[:id]
  end

  def code
    data[:code]
  end

end # === class Screen_Name_Code read ===





