
require './Server/Okdoki/model'

require_crud :File_Name

class File_Name

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :file_name
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class File_Name ===





