
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
    if hash.has_key?(:code)
      hash[:code] = MultiJson.dump(Okdoki::Escape_All.escape MultiJson.load(hash[:code]))
    end
    hash
  end

  def validate_class_id hash
    if hash.has_key?(:class_name)
      hash[:class_id] = File_Name.read_create(hash[:class_name]).id
    end

    hash
  end

end # === class Computer ===






