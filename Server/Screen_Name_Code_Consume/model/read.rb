
class Story
  class << self
    def okdoki_id
      2
    end
  end # === class self ===
end

class Magazine
  class << self
    def okdoki_id
      1
    end
  end # === class self ===
end

class Screen_Name_Code_Consume

  class << self

    def read_for_consume producer, consumer
    end

  end # === class self ===

  def producer_id
    data[:producer_id]
  end

  def consumer_id
    data[:consumer_id]
  end

end # === class Screen_Name_Code_Consume read ===





