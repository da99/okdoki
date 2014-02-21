
require './Server/Okdoki/model'

require_crutd :Screen_Name_Code

class Screen_Name_Code

  EVENT_NAMES = {
    1 => "on profile view"
  }

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :screen_name_code
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  class << self
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def validate_code hash
    hash[:code] = MultiJson.dump(Okdoki::Escape_All.escape hash[:code])
    hash
  end

  def validate_event_name_id hash
    Okdoki::Vador.new(self, :event_name_id, hash).
      clean(:strip, :upcase).
      set_to_integer.
      match(EVENT_NAMES.keys, 'Invalid event name for code.').
      data
  end

end # === class Screen_Name_Code ===





