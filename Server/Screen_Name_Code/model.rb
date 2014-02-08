
require './Server/Okdoki/model'
require './Server/Okdoki/Escape_All'
require 'multi_json'

require_crutd :Screen_Name_Code

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

  def code
    data[:code]
  end

  def target_as_word
    TYPES[data[:target]]
  end

  def validate key
    case key
    when :code
      super(key).
        set_to(MultiJson.dump Ok::Escape_All.escape(clean_data[:code]))
    when :target
      super(key).
        in(Bot_Code::TYPES, "'target' must be one of these: #{Bot_Code::TYPES.join ', '}").
        set_to(Bot_Code::TYPES.index(clean_data[key]))
    else
      super
    end
  end

end # === class Bot_Code ===





