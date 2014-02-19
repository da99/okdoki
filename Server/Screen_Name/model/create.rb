
class Screen_Name

  def create raw_data, *args

    case raw_data
    when :bot
      return( @bot = Bot.create self )
    when :chit_chat
      return Chit_Chat.create(self, *args)
    when :i_know_them
      return I_Know_Them.create(self, *args)
    end

    if raw_data == :bot_use
      return Bot_Use.create(self, *args)
    end

    if raw_data == :i_know_them
      return I_Know_Them.create(self, *args)
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
       :display_name => clean_data[:screen_name]
    }

    begin
      new_record = TABLE.returning.insert(insert_data).first
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"screen_name_unique_idx"']
      raise self.class::Invalid.new(self, "Screen name already taken: #{clean_data[:screen_name]}")
    end

    me = self.class.new(new_record)
    if is_new_owner
      me.data[:owner_id] = me.id
      new_data[:customer].clean_data[:id] = me.id
    end

    return me unless is_new_owner

    # // ==== This is a new customer
    # // ==== so we must use the screen name id
    # // ==== as the owner_id because customer record
    # // ==== has not been created.
    new_row = TABLE.returning.where(:id=>me.id).update(:owner_id=>me.id).first
    new_data[:customer].data[:id] = me.id
    new_data[:customer].screen_names.push me

    self.class.new(me.data.merge new_row)
  end # === def create

  def upsert name, *args
    case name
    when :code
      Screen_Name_Code.upsert self, *args
    else
      raise  "Unknown option: #{name.inspect}"
    end
  end

end # === class Screen_Name create ===





