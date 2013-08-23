
require './Server/Ok/model'
require "./Server/MODEL/model/create"
require "./Server/MODEL/model/read"
require "./Server/MODEL/model/update"
require "./Server/MODEL/model/trash"
require "./Server/MODEL/model/delete"

class MODEL

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :~model
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class MODEL ===





