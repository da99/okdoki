
class File_Name

  class << self

    def create raw_name
      name = File_Name.standardize(raw_name)
      File_Name.new(
        DB[
          %~
            INSERT INTO file_name (file_name)
            VALUES ( :file_name )
            RETURNING *
          ~,
          :file_name=>name
        ].first
      )
    end

  end # === class self

end # === class File_Name create ===





