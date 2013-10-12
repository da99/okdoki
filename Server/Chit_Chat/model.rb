
require './Server/Ok/model'

require_crutd :Chit_Chat

class Chit_Chat

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  TABLE           = DB[:chit_chat]

  TYPE_IDS        = %{
    chit_chat
  }

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def initialize *args
    super
  end


end # === class Chit_Chat ===





