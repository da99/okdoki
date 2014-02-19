
class Screen_Name_Code

  def create bot, raw
    @new_data = raw
    validate(:screen_name_id).required
    validate(:event_name_id)
    validate(:code).required

    begin
      row = TABLE.
        returning.
        insert(screen_name_id: clean_data[:screen_name_id], code: clean_data[:code]).
        first

      Screen_Name_Code.new(row, bot)
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['duplicate key value violates unique constraint "screen_name_code_target_idx"']
      raise Screen_Name_Code::Invalid.new(self, "Code already exists for: #{bot.screen_name} #{TYPES[clean_data[:target]]}")
    end
  end # === def create

end # === class Screen_Name_Code create ===





