
require './Server/Okdoki/model'

require_crutd :Screen_Name_Code_Consume

class Screen_Name_Code_Consume

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = self.to_s.downcase
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  class << self

    def table_for_owners sn
      Screen_Name_Code_Consume::TABLE.where(sn_id: sn.id)
    end

  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  attr_reader :screen_name, :bot

  def initialize *args
    if args.size == 3
      @bot = args.pop
      @screen_name = args.pop
      super(*args)
    else
      super
    end
  end

end # === class Screen_Name_Code_Consume ===





