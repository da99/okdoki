
require './Server/Okdoki/model'

require_crutd :Screen_Name_Code

class Screen_Name_Code

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

end # === class Screen_Name_Code ===





