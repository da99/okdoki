
class Computer

  def update raw
    data = validate_code(raw)
    @data.merge!(
      TABLE.returning.
      where(:id=>id).
      update(:code=>data[:code]).
      first || {}
    )
  end # === def update

end # === class Computer ===





