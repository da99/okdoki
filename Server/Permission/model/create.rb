
class Permission

  def create from, pub, to
    insert_data = {
      :from_id     => from.id,
      :pub_type_id => self.class.to_pub_type_id(pub),
      :pub_id      => pub.id,
      :to_id       => to.id
    }

    begin
      row = TABLE.returning.insert(insert_data)
    rescue Sequel::UniqueConstraintViolation=>e
      if e.message['"permission_unique_idx"']
        row = insert_data
      else
        raise e
      end
    end

    self.class.new(row)
  end

end # === class Permission create ===





