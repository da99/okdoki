
class Customer

  def create new_vals
    @new_data = new_vals

    validate(:ip)
    validate(:password).required('Pass phrase is required.')
    validate(:confirm_password).required("Pass phrase confirmation is required.")

    new_vals[:customer] = self
    Screen_Name.create(new_data)

    rec = TABLE.
      returning(:id).
      insert({
        pswd_hash: encode_password(clean_data[:password]),
        id: clean_data[:id]
      }).first

    @data.merge! rec

    self
  end # === create

end # === class Customer create ===





