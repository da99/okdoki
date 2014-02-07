
class Bot_Code

  class << self

    def read_all_for_bot bot
      Bot_Code.new(TABLE.where(bot_id: bot.id).all)
    end

  end # === class self ===

end # === class Bot_Code read ===





