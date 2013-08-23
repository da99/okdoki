
class Screen_Name

  def update raw_data
    @new_data = raw_data
    c = raw_data[:customer]
    validate :screen_name
    validate(:about).
      set_to_nil_if_empty
    validate :type_id
    validate(:nick_name).
      set_to_nil_if_empty

    if clean_data[:screen_name]
      clean_data[:display_name] = clean_data[:screen_name]
    end

    row = TABLE.
      returning.
      where(:screen_name=>data[:screen_name]).
      update(clean_data).
      first

    @data.merge data

    self
  end # === def update

end # === class Screen_Name update ===





