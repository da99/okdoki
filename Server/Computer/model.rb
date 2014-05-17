
require './Server/Okdoki/model'
require './Server/Okdoki/Vador'
require './Server/Okdoki/Escape_All'
require 'multi_json'

require_crud :Computer

class Computer

  include Okdoki::Model

  EVENT_NAMES = {
    1 => "ON VIEW PROFILE"
  }

  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :computer
  TABLE = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  class << self
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def validate_code hash
    hash[:code] = MultiJson.dump(Okdoki::Escape_All.escape MultiJson.load(hash[:code]))
    hash
  end

end # === class Computer ===






