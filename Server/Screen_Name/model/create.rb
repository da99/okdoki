
class Screen_Name

  def create raw_data
    return( @bot = Bot.create self ) if raw_data == :bot

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

    me = self.class.new(new_record)
    if is_new_owner
      me.data[:owner_id] = me.id
      new_data[:customer].clean_data[:id] = me.id
    end

    return me unless new_data[:customer]


    # // ==== This is a new customer
    # // ==== so we must use the screen name id
    # // ==== as the owner_id because customer record
    # // ==== has not been created.
    TABLE.where(:id=>me.id).update(:owner_id=>me.id)
    new_data[:customer].data[:id] = me.id
    new_data[:customer].screen_names.push me

    me
  end # === def create


end # === class Screen_Name create ===





