
require './Server/Okdoki/model'
require './Server/Okdoki/Escape_All'
require 'multi_json'

require_crutd :Screen_Name_Code

class Screen_Name_Code

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :screen_name_code
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
        set_to(MultiJson.dump Okdoki::Escape_All.escape(clean_data[:code]))
    when :target
      super(key).
        in(Screen_Name_Code::TYPES, "'target' must be one of these: #{Screen_Name_Code::TYPES.join ', '}").
        set_to(Screen_Name_Code::TYPES.index(clean_data[key]))
    else
      super
    end
  end

end # === class Screen_Name_Code ===





