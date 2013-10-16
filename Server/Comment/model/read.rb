
class Comment

  def id
    data[:id]
  end

  class << self

    def read pub
      rows = Comment::TABLE.where(:pub_type_id=>to_pub_type_id(pub), :pub_id=>pub.id).all

      new rows
    end

  end # === class self

end # === class Comment read ===





