
require './Server/Okdoki/model'
require './Server/Okdoki/Vador'
require './Server/Okdoki/Escape_All'
require 'multi_json'

require_crutd :Screen_Name_Code

class Screen_Name_Code

  EVENT_NAMES = {
    1 => "ON VIEW PROFILE"
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
    @screen_name = if args.size == 2
                     args.pop
                   else
                     nil
                   end
    super(*args)
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
    hash[:code] = MultiJson.dump(Okdoki::Escape_All.escape MultiJson.load(hash[:code]))
    hash
  end

  def validate_event_name_id hash
    event_name_id = self.class.to_event_name_id(hash[:event_name_id]) rescue hash[:event_name_id]
    Okdoki::Vador.new(self, :event_name_id, hash).
      set_to(event_name_id).
      set_to_integer.
      in(EVENT_NAMES.keys, 'Invalid event name.').
      data
  end

end # === class Screen_Name_Code ===





