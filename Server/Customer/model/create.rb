
class Customer

  def create new_vals, *args

    if new_vals == :screen_name
      return Screen_Name.create :screen_name=>args.first, :customer=>self
    end

    @new_data = new_vals

    validate(:ip)
    validate(:pass_word).required('Pass phrase is required.')
    validate(:confirm_pass_word).required("Pass phrase confirmation is required.")

    new_vals[:customer] = self
    Screen_Name.create(new_data)

    rec = TABLE.
      returning(:id).
      insert({
        pswd_hash: encode_pass_word(clean_data[:pass_word]),
        id: clean_data[:id]
      }).first

    self.class.new rec
  end # === create

end # === class Customer create ===





