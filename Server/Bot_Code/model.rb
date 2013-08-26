
require './Server/Ok/model'

require_crutd :Bot_Code

class Bot_Code

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :bot_code
  TABLE = DB[Table_Name]
  TYPES = %w{
    custom
    settings
    omni
    profile
  }

  code = clean_code new_data[:code]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Bot_Code ===





