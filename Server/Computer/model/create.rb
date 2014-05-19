
class Computer

  class << self

    def create owner, path, code
      new.create(
        :owner_id => owner.id,
        :path     => path,
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





