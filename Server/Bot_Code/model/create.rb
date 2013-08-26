
class Bot_Code

  def create bot, raw
    @new_data = raw
    @new_data[:bot] = bot
    validate(:target).required
    validate(:code).required

    row = TABLE.
      returning.
      insert(bot_id: bot.id, target: clean_data[:target], code: clean_data[:code]).
      first

    Bot_Code.new(row, bot)
  end # === def create

end # === class Bot_Code create ===





