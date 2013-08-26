
class Bot

  def create sn
    begin
    row = TABLE.
      returning.
      insert(sn_id: sn.data[:id], sn_type: (sn.is_a?(Screen_Name) ? 0 : 1)).
      first
    @data = row
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"bot_screen_name"']
      raise self.class::Invalid.new(self, "Bot already exists for: #{sn.name}")
    end
    self
  end # === def create

end # === class Bot create ===





