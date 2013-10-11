
class Screen_Name_Sub

  def create sn_obj, raw_name
    name = raw_name.strip.gsub(/[^a-zA-Z0-9\_\-\.]+/, '').upcase
    name = "no_name" if name.empty?

    insert_data = {
      :owner_id     => sn_obj.data[:id],
      :is_sub       => true,
      :screen_name  => name,
      :display_name => name
    }

    begin
      new_record = TABLE.returning.insert(insert_data).first
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"screen_name_sub_unique_idx"']
      raise self.class::Invalid.new(self, "Screen name already created: #{name}@#{sn_obj.screen_name}")
    end

    self.class.new(new_record)
  end # === def create

end # === class Screen_Name_Sub create ===





