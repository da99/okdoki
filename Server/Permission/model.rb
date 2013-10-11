
require './Server/Ok/model'

require_crutd :Permission

class Permission

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :permission
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Permission ===





