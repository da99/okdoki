
class Screen_Name_Code_Consume

  class << self

    def create prod, cons
      r = new
      r.create :producer=>prod,
        :consumer=>cons,
        :producer_id=>prod.id,
        :consumer_id=>cons.id
    end

  end # === class self ===

  def create raw
    data = [:producer_id, :consumer_id].inject(raw) { |memo, v|
      send "validate_#{v}", memo
    }

    begin
    rec = TABLE.
      returning.
      insert(producer_id: data[:producer_id], consumer_id: data[:consumer_id]).
      first
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['unique constraint "screen_name_code_consume_unique"']
      prod = raw[:producer].screen_name
      cons = raw[:consumer].screen_name
      raise self.class::Invalid.new(self, "Subscription already exists: #{cons} -> #{prod}")
    end

    @data = rec
    self
  end # === def create

end # === class Screen_Name_Code_Consume create ===





