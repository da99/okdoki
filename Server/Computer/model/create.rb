
class Computer

  class << self

    def create owner, class_name, code
      r = new
      klass_id = File_Name.read_create(class_name).id
      r.create(
        :class_id => klass_id,
        :owner_id => owner.id,
        :code     => code
      )
    end

  end # === class self ===

  def create data
    data = validate_code(data)

    row = DB.fetch( %~
            INSERT INTO computer (file_id, owner_id, class_id, code)
            SELECT
              COALESCE(MAX(file_id), MAX(file_id), 0) + 1 AS "file_id",
              :owner_id AS "owner_id",
              :class_id AS "class_id",
              :code     AS "code"
            FROM computer
            WHERE owner_id = :owner_id AND class_id = :class_id
            RETURNING *
          ~, data).first

    Computer.new(row)
  end # === def create

end # === class Computer create ===





