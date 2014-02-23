
require './Server/Okdoki/model'

require_crutd :Screen_Name_Code_Consume

class Screen_Name_Code_Consume

  include Okdoki::Model

  # =====================================================
  # Settings
  # =====================================================

  Table_Name = self.to_s.downcase
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  class << self
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

end # === class Screen_Name_Code_Consume ===





