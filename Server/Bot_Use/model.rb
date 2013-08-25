
require './Server/Ok/model'

require_crutd :Bot_Use

class Bot_Use

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :bot_use
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def to_public
    {
      bot:         data[:bot],
      owner:       data[:owner],
      screen_name: data[:bot]
    }
  end



end # === class Bot_Use ===





