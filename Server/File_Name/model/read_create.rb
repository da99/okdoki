
class File_Name

  class << self

    def read_create raw_name
      name = File_Name.standardize(raw_name)

      row = TABLE.
        returning.
        where(:file_name=>name).
        first

      row ||= DB[
        %~
          INSERT INTO file_name (file_name)
          VALUES ( :file_name )
          RETURNING *
        ~,
        :file_name=>name
      ].first
      File_Name.new(row)
    end

  end # === class self

end # === class File_Name read_create ===





