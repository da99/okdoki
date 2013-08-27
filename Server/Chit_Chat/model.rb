
require './Server/Ok/model'

require_crutd :Chit_Chat

class Chit_Chat

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  TABLE           = DB[:chit_chat]
  TABLE_TO        = DB[:chit_chat_to]
  TABLE_LAST_READ = DB[:chit_chat_last_read]

  TYPES           = %{
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
    if args.size == 2
      @from = args.pop
      super(*args)
    else
      super
    end
  end


end # === class Chit_Chat ===





