
class Screen_Name_Code

  class << self

    def read_all_for_bot bot
      Screen_Name_Code.new(TABLE.where(bot_id: bot.id).all)
    end

  end # === class self ===

  def code
    data[:code]
  end

end # === class Screen_Name_Code read ===





