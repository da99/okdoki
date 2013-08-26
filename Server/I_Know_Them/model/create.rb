
class I_Know_Them

  class << self

    def create owner, target
      new_data = {
        owner_id: owner.id,
        target_id: target.id,
        is_follow: true
      }

      row = TABLE.
        returning.
        insert(new_data).
        first

      new row, owner, target
    end

  end # === class self ===

end # === class I_Know_Them create ===





