
require './Server/Ok/model'

require_crutd :Chit_Chat

class Chit_Chat

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :chit_chat
  TABLE = DB[Table_Name]
  TABLE_LAST_READ = DB[:chit_chat_last_read]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Chit_Chat ===





