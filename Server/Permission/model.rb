
require './Server/Okdoki/model'

require_crutd :Permission

class Permission

  include Okdoki::Model

  Screen_Name_Type_Id = 1

  # =====================================================
  # Settings
  # =====================================================


  # =====================================================
  # Class
  # =====================================================

  class << self

    def to_pub_type_id o
      case o
      when Screen_Name
        Screen_Name_Type_Id
      else
        raise "Unknown type: #{o.class}"
      end
    end
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Permission ===





