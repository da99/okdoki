
require './Server/Okdoki/model'

require_crutd :Follow

class Follow

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Screen_Name_Class_Id = 1

  # =====================================================
  # Class
  # =====================================================

  class << self

    def to_pub_class_id o
      case o
      when Screen_Name
        Screen_Name_Class_Id
      else
        raise "Unknown pub type: #{o.class}"
      end
    end

  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Follow ===





