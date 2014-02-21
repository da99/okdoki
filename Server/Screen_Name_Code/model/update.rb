
class Screen_Name_Code

  def update raw
    data = validate_code(raw)
    self.class.new TABLE.returning.
      where(:id=>id).
      update(:code=>data[:code]).
      first
  end # === def update

end # === class Screen_Name_Code update ===





