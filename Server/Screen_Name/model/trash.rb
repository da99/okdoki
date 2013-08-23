
class Screen_Name

  class << self

    def delete_trashed
      Ok.deleted_trashed s
    end

    def delete_by_owner_ids arr
      sql = %^
        DELETE FROM #{Table_Name} WHERE owner_id IN (
          #{ arr.map { |n, i| "$#{i+1}" }).join(', ') }
        ) RETURNING * ;
      ^
      TABLE[sql, arr]
    end

  end # === class self ===

  def untrash id
    Ok.untrash self, id
  end

  def trash id
    Ok.trash self, id
  end

end # === class Screen_Name trash ===





