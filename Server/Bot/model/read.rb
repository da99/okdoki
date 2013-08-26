
class Bot
  class << self

    def read_by_screen_name sn
      row = Bot::TABLE[sn_id: sn.data[:id], sn_type: Bot::SN_TYPES::SN]
      if row
        Bot.new(row)
      else
        raise self::Not_Found.new("Bot not found for: #{sn.name}")
      end
    end

  end # === class self ===
end # === class Bot ===
