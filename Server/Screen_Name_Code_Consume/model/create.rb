
class Screen_Name_Code_Consume

  def create sn, bot
    @new_data = @clean_data = {
      bot_id: bot.id,
      sn_id: sn.id
    }

    rec = TABLE.
      returning.
      insert(clean_data).
      first

    Screen_Name_Code_Consume.new rec, sn, bot
  end # === def create

end # === class Screen_Name_Code_Consume create ===





