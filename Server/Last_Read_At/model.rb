
require './Server/Ok/model'

require_crutd :Last_Read_At

class Last_Read_At

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :last_read_at
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Last_Read_At ===





