
require './Server/Ok/model'

require_crutd :Bot

class Bot

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :bot
  TABLE = DB[Table_Name]

  module SN_TYPES
    SN     = 0
    SN_SUB = 1
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

    def table_for_non_owner sn
      TABLE
    end

  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def initialize *args
    @screen_name = args.pop if args.size > 1
    @codes       = []
    super(*args)
  end

  def clean_code str
    JSON.encode(ESCAPE_ALL(JSON.parse(UNESCAPE str)))
  end

  def name
    @screen_name.name
  end

end # === class Bot ===





