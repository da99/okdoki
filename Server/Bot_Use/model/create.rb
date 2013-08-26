
class Bot_Use

  def create sn, bot
    @new_data = @clean_data = {
      bot_id: bot.id,
      sn_id: sn.id,
      sn_type: 0
    }

    rec = TABLE.
      returning.
      insert(clean_data).
      first

    Bot_Use.new rec, sn, bot

  end # === def create

end # === class Bot_Use create ===





