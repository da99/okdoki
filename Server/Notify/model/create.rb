
class Notify

  class << self

    def create_or_update from, to, body
      row = TABLE.returning.
        where(:from_id=>from.id, :to_id=>to.id).
        update(:body=>body, :updated_at=>Sequel.lit("timezone('UTC'::text, now())")).
        first
      if !row
        row = TABLE.returning.insert(:from_id=>from.id, :to_id=>to.id, :body=>body).first
      end

      Notify.new row
    end

  end # === class

end # === class Notify create ===





