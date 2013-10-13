
class Follow

  class << self

    def create pub, follower
      insert_data = {
        :pub_type_id => to_pub_type_id(pub),
        :pub_id      => pub.id,
        :follower_id => follower.id
      }

      new TABLE.returning.insert(insert_data).first
    end

  end # === class self

end # === class Follow create ===





