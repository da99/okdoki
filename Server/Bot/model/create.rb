
class Bot

  def create sn, *args
    return Bot_Code.create(self, *args) if sn == :code
    begin
      row = TABLE.
        returning.
        insert(id: sn.data[:id]).
        first

      Bot.new( row, sn )
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"bot_screen_name"']
      raise self.class::Invalid.new(self, "Bot already exists for: #{sn.screen_name}")
    end
  end # === def create

end # === class Bot create ===





