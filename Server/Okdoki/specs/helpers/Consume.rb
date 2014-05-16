
require "./Server/Consume/model"

module Consume_Test

  def create_follow consumer, pub
    Consume.create consumer, pub
  end

  def delete_all_follows
    Consume::TABLE.delete
  end

end # === module Follow ===
