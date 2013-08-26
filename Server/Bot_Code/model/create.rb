
class Bot_Code

  def create bot, raw
    @new_data = raw
    @new_data[:bot] = bot
    validate(:target).required
    validate(:code).required

    begin
      row = TABLE.
        returning.
        insert(bot_id: bot.id, target: clean_data[:target], code: clean_data[:code]).
        first

      Bot_Code.new(row, bot)
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['duplicate key value violates unique constraint "bot_code_target_idx"']
      raise Bot_Code::Invalid.new(self, "Bot code already exists for: #{bot.name} #{TYPES[clean_data[:target]]}")
    end
  end # === def create

end # === class Bot_Code create ===





