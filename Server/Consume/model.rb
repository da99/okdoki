
require_crutd :Consume

class Consume

  include Okdoki::Model

  # =====================================================
  # Settings
  # =====================================================

  # =====================================================
  # Class
  # =====================================================

  class << self
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





