
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

  class << self

    def table_for_owners sn
      Bot_Use::TABLE.where(sn_type: 0, sn_id: sn.id)
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

  def to_public
    {
      bot:         data[:bot],
      owner:       data[:owner],
      screen_name: data[:bot]
    }
  end

end # === class Bot_Use ===





