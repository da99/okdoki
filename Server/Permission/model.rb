
require './Server/Okdoki/model'

require_crud :Permission

class Permission

  include Okdoki::Model

  Screen_Name_Class_Id = 1

  # =====================================================
  # Settings
  # =====================================================


  # =====================================================
  # Class
  # =====================================================

  class << self

    def to_pub_class_id o
      case o
      when Screen_Name
        Screen_Name_Class_Id
      else
        raise "Unknown type: #{o.class}"
      end
    end
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Permission ===





