
class Bot

  def create owner
    row = TABLE.
      returning.
      insert(owner_id: owner.data[:id], owner_type: 0).
      first
    @data = row
    self
  end # === def create

end # === class Bot create ===





