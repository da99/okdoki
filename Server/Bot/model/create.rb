
class Bot

  def create sn, raw = nil
    return Bot_Code.create(self, raw) if sn == :code
    begin
      row = TABLE.
        returning.
        insert(sn_id: sn.data[:id]).
        first

      Bot.new( row, sn )
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"bot_screen_name"']
      raise self.class::Invalid.new(self, "Bot already exists for: #{sn.name}")
    end
  end # === def create

end # === class Bot create ===





