
class Screen_Name

  def create raw_data
    case raw_data
    when :bot
      @bot = Bot.create self
      return bot
    end

    # === Validate the data.
    @new_data = raw_data
    @clean_data = {}
    is_new_owner = !new_data[:customer].data[:id]

    validate(:screen_name).required

    validate(:type_id)

    validate(:read_able).
      one_of_these(['@W', '@P', '@N'], "Allowed values: @W (world) @P (private) @N (no one)")

    insert_data = {
       :owner_id     => is_new_owner ? 0 : new_data[:customer].data[:id],
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
    if is_new_owner
      @data[:owner_id] = @data[:id]
      new_data[:customer].clean_data[:id] = @data[:id]
    end

    return self unless new_data[:customer]


    # // ==== This is a new customer
    # // ==== so we must use the screen name id
    # // ==== as the owner_id because customer record
    # // ==== has not been created.
    TABLE.where(:id=>self.data[:id]).update(:owner_id=>self.data[:id])
    new_data[:customer].data[:id] = self.data[:id]
    new_data[:customer].screen_names.push self

    self
  end # === def create


end # === class Screen_Name create ===





