
class Customer

  def create new_vals
    @new_data = new_vals

    validate(:ip)
    validate(:password)
    validate(:confirm_password)

    new_vals[:customer] = self
    sn = Screen_Name.create(new_data)

    rec = TABLE.
      returning(:id).
      insert({
      pswd_hash: Sequel.lit("crypt(?, gen_salt('bf', 11))", clean_data[:password]),
      id: sn.data[:owner_id]
    }).first

    @data.merge! rec

    self
  end # === create

end # === class Customer create ===





