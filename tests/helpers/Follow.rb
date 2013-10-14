
module Follow_Test

  def create_follow from, to
    Follow.create from, to
  end

  def delete_all_follows
    Follow::TABLE.delete
  end

end # === module Follow ===
