
class Screen_Name

  def create raw_data
    # === Validate the data.
    @new_data = raw_data
    @clean_data = {}

    validate(:screen_name)

    validate(:type_id)

    insert_data = {
       :owner_id     => new_data[:customer] ? new_data[:customer].data.id : 0,
       :screen_name  => clean_data[:screen_name],
       :display_name => clean_data[:screen_name],
       :type_id      => (clean_data[:type_id] || 0)
    }

    begin
      new_record = TABLE.returning.insert(insert_data).first
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"screen_name_screen_name_key"']
      raise self.class::Invalid.new(self, "Screen name already taken: #{clean_data[:screen_name]}")
    end

    #, 'screen_name', 'Screen name alread taken: ' + insert_data[:screen_name])

    @data.merge! new_record
    return self if new_data[:customer]


    # // ==== This is a new customer
    # // ==== so we must use the screen name id
    # // ==== as the owner_id because customer record
    # // ==== has not been created.
    TABLE.where(:id=>self.data[:id]).update(:owner_id=>self.data[:id])

    self
  end # === def create


end # === class Screen_Name create ===





