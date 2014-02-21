
require './Server/Okdoki/model'
require './Server/Okdoki/Vador'
require './Server/Okdoki/Escape_All'
require 'multi_json'

require_crutd :Screen_Name_Code

class Screen_Name_Code

  EVENT_NAMES = {
    1 => "on profile view"
  }

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :screen_name_code
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  class << self
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  #
  # Possible args:
  #
  #   data_hash
  #   Screen_Name, data_hash
  #
  def initialize *args
    case args.size
    when 0
      @data        = {}
      @screen_name = nil
    when 1
      @data = args.first
      @screen_name = nil
    when 2
      @data = args.last
      @screen_name = args.first
    else
      raise ArgumentError, "Only 1 or 2 args allowed: #{args.inspect}"
    end
  end

  #
  # Requires hash[:screen_name]
  #
  def validate_screen_name_id hash
    sn_o  = hash[:screen_name]
    sn_id = sn_o.id

    hash[:screen_name_id] = Integer(sn_id) rescue 0
    invalid_new("Invalid screen name: #{sn_o.screen_name}") unless hash[:screen_name_id] > 0

    hash
  end

  def validate_code hash
    hash[:code] = MultiJson.dump(Okdoki::Escape_All.escape hash[:code])
    hash
  end

  def validate_event_name_id hash
    Okdoki::Vador.new(self, :event_name_id, hash).
      clean(:strip, :upcase).
      set_to_integer.
      match(EVENT_NAMES.keys, 'Invalid event name for code.').
      data
  end

end # === class Screen_Name_Code ===





