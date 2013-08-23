
class Screen_Name

  def update raw_data
    validate :screen_name
    validate :about
    validate :type_id
    validate(:nick_name)
      .set_to_nil_if_empty()

    # -------------------------------
    # === Update row in customer list
    # -------------------------------

  end # === def update

end # === class Screen_Name update ===





