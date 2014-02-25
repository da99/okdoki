
class Screen_Name_Code

  class << self

    def create sn, event_name_id, who, code
      r = new
      r.create :screen_name => sn,
        :screen_name_id => sn.id,
        :who_id => who,
        :event_name_id => event_name_id,
        :code => code
    end

  end # === class self ===

  def create raw_data
    target_keys = [:screen_name_id, :who_id, :event_name_id, :code]

    data = target_keys.inject(raw_data) { |memo, n|
      send :"validate_#{n}", memo
    }.keep_if { |k,v| target_keys.include?(k) }

    begin
      row = TABLE.
        returning.
        insert(data).
        first

      Screen_Name_Code.new(raw_data[:screen_name], row)
    rescue Sequel::UniqueConstraintViolation => e
      if e.message['duplicate key value violates unique constraint "unique_screen_name_id_to_event_name_id_idx"']
        event_name = self.class.to_event_name(data[:event_name_id])
        sn  = raw_data[:screen_name] && raw_data[:screen_name].screen_name
        raise Screen_Name_Code::Invalid.new(self, "Code already exists for: #{sn.inspect} -> #{event_name.inspect}")
      end
      raise e
    end
  end # === def create

end # === class Screen_Name_Code create ===





