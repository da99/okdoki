
require './Server/Okdoki/model'

require_crutd :Consume

class Consume

  include Okdoki::Model

  # =====================================================
  # Settings
  # =====================================================
  Screen_Name_Class_Id = 1

  # =====================================================
  # Class
  # =====================================================

  class << self

    def to_pub_class_id o
      case o
      when Screen_Name
        Screen_Name_Class_Id
      else
        raise "Unknown pub type: #{o.class}"
      end
    end

  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def validate_producer_id raw
    Okdoki::Vador.new(self, :producer_id, raw).
      set_to_integer.
      data
  end

  def validate_consumer_id raw
    Okdoki::Vador.new(self, :consumer_id, raw).
      set_to_integer.
      data
  end

end # === class Consume ===





