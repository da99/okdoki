
class Computer

  class << self

    def create owner, code
      new.create(
        :owner_id => owner.id,
        :path     => WWW_Applet.new(code).extract_first("path").last,
        :code     => code
      )
    end

  end # === class self ===

  def create data
    data = validate_path validate_code(data)

    row = TABLE.
      returning.
      insert(data).
      first

    Computer.new(row)
  end # === def create

end # === class Computer create ===





