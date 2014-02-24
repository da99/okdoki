
require './Server/Okdoki/model'

require_crutd :Screen_Name_Code_Consume

class Screen_Name_Code_Consume

  include Okdoki::Model

  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :screen_name_code_consume
  TABLE = DB[Table_Name]

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

end # === class Screen_Name_Code_Consume ===





