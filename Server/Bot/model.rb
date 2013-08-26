
require './Server/Ok/model'

require_crutd :Bot

class Bot

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :bot
  TABLE = DB[Table_Name]

  module OWNERS
    SCREEN_NAME = 0
  end # === module OWNERS ===

  # =====================================================
  # Class
  # =====================================================

  class << self
    def extract_name o
      if o.data[:screen_name]
        return Screen_Name.canonize(o.data[:screen_name]).split('@');
        return [o.sub_sn, o.owner];
      end
    end
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def to_public
    { codes: codes.to_public }
  end

  def clean_code str
    JSON.encode(ESCAPE_ALL(JSON.parse(UNESCAPE str)))
  end

end # === class Bot ===





