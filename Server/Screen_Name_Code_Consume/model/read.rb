
class Story
  include Okdoki::Model
  class << self
    def okdoki_id
      10
    end
  end # === class self ===
end

class Magazine
  include Okdoki::Model
  class << self
    def okdoki_id
      11
    end
  end # === class self ===
end

require "./Server/Okdoki/SQL_Code"

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





