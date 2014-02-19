
require './Server/Okdoki/model'

require_crutd :Screen_Name_Code

class Screen_Name_Code

  EVENT_NAMES = {
    1 => "profile view"
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

  def validate *args
    case args.first

    when :code
      super.
        set_to(MultiJson.dump Okdoki::Escape_All.escape(clean_data[:code]))

    when :event_name_id
      super.
        clean('strip', 'upcase').
        set_to(Integer clean_data[:event_name_id]).
        match(EVENT_NAMES.keys, 'Invalid event name for code.')

    else
      super

    end
  end

end # === class Screen_Name_Code ===





