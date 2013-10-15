
require "./Server/Follow/model"

module Follow_Test

  def create_follow consumer, pub
    Follow.create pub, consumer
  end

  def delete_all_follows
    Follow::TABLE.delete
  end

end # === module Follow ===
