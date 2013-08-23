
class Customer

  def create new_vals, flow
    @new_data = new_vals

    sn = Screen_Name.create(new_vals)

    validate(:ip)
    validate(:password)
    validate(:confirm_password)
    clean_data[:id] = sn.data[:owner_id]

    DB.brcyot_pswd
    rec = TABLE.returning.insert(clean_data).first

    @data.merge! rec

    self
  end # === create

end # === class Customer create ===





