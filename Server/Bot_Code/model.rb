
require './Server/Ok/model'
require './Server/Ok/Escape_All'

require_crutd :Bot_Code

class Bot_Code

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :bot_code
  TABLE = DB[Table_Name]
  TYPES = %w{
    custom
    settings
    omni
    profile
  }


  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  attr_reader :bot

  def initialize *args
    @bot = args.pop if args.size > 1
    super(*args)
  end

  def bot_id
    data[:bot_id]
  end

  def validate key
    case key
    when :code
      super(key).
        set_to(Ok::Escape_All.escape(clean_data[:code]))
    when :target
      super(key).
        in(Bot_Code::TYPES, "'target' must be one of these: #{Bot_Code::TYPES.join ', '}").
        set_to(Bot_Code::TYPES.index(clean_data[key]))
    else
      super
    end
  end

end # === class Bot_Code ===





