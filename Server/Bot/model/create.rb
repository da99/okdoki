
class Bot

  def create owner
    row = TABLE.
      returning.
      insert(sn_id: owner.data[:id], sn_type: (owner.is_a?(Screen_Name) ? 0 : 1)).
      first
    @data = row
    self
  end # === def create

end # === class Bot create ===





