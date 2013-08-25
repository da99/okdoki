
class Bot

  def update raw
    @new_data = raw
    code = escape new_data[:code]
  end # === def update

end # === class Bot update ===





