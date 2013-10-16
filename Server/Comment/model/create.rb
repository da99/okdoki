
class Comment

  def create author, pub, body
    insert_data = {
      :author_id   => author.id,
      :pub_type_id => self.class.to_pub_type_id(pub),
      :pub_id      => pub.id,
      :body        => body
    }

    row = TABLE.returning.insert(insert_data).first

    self.class.new(row)
  end

end # === class Comment create ===





