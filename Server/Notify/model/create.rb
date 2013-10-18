
class Notify

  class << self

    def create_or_update author, body
      row = TABLE.returning.
        where(:author_id=>author.id).
        update(:body=>body).
        first
      if !row
        row = TABLE.returning.insert(:author_id=>author.id, :body=>body).first
      end

      Notify.new row
    end

  end # === class

end # === class Notify create ===





