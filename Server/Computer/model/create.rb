
class Computer

  class << self

    def create class_id, consumer, producer, code
      r = new
      r.create :class_id => class_id,
        :consumer => consumer,
        :producer => producer,
        :code => code
    end

  end # === class self ===

  def create raw_data
    target_keys = [
      :class_id,
      :consumer_id,
      :consumer_class_id,
      :producer_id,
      :producer_class_id,
      :code
    ]

    data = target_keys.inject(raw_data) { |memo, n|
      send :"validate_#{n}", memo
    }.keep_if { |k,v| target_keys.include?(k) }

    begin
      row = TABLE.
        returning.
        insert(data).
        first

      Computer.new(consumer.screen_name, row)
    rescue Sequel::UniqueConstraintViolation => e
      if e.message['duplicate key value violates unique constraint "computer_unique_idx"']
        event_name = self.class.to_event_name(data[:event_name_id])
        sn  = producer.screen_name
        raise Computer::Invalid.new(self, "Computer already exists for: #{sn.inspect} -> #{event_name.inspect}")
      end
      raise e
    end
  end # === def create

end # === class Computer create ===





