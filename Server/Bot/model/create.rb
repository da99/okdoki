
class Bot

  def create raw_data
    @new_data = raw_data
    raise "not ready"
    code = clean_code new_data[:code]
  end # === def create

end # === class Bot create ===





