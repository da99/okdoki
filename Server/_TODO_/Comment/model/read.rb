
class Comment

  def id
    data[:id]
  end

  class << self

    def read pub
      rows = Comment::TABLE.
        where(:pub_class_id=>to_pub_class_id(pub), :pub_id=>pub.id).
        order_by(Sequel.lit("created_at DESC")).
        limit(Read_All_Limit).
        all

      new rows
    end

  end # === class self

end # === class Comment read ===





