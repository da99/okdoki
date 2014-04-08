
class Follow

  class << self

    def create follower, pub
      insert_data = {
        :pub_class_id => to_pub_class_id(pub),
        :pub_id      => pub.id,
        :follower_id => follower.id
      }

      begin
        new TABLE.returning.insert(insert_data).first
      rescue Sequel::UniqueConstraintViolation => e
        raise e unless e.message['unique constraint "follow_unique_idx"']
        new insert_data
      end
    end

  end # === class self

end # === class Follow create ===





