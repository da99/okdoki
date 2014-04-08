
class Comment

  def create author, pub, body
    pub_row = (pub.class::TABLE)
      .select(:comment_count)[:id=>pub.id]
    pub_count = pub_row[:comment_count]

    if pub_count >= Create_Limit
      raise Limit_Reached.new(self, "Comment limit reached. No more comments can be created.")
    end

    insert_data = {
      :author_id   => author.id,
      :pub_class_id => self.class.to_pub_class_id(pub),
      :pub_id      => pub.id,
      :body        => body
    }

    row = TABLE.returning.insert(insert_data).first
    pub.class::TABLE.update(Sequel.lit " comment_count = comment_count + 1 ")

    self.class.new(row)
  end

end # === class Comment create ===





