
require './Server/Okdoki/model'

require_crutd :Comment

class Comment

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :comment
  TABLE = DB[Table_Name]

  Chit_Chat_Type_Id = 1

  Read_All_Limit    = 22
  Create_Limit      = 22

  # =====================================================
  # Class
  # =====================================================

  class << self

    def to_pub_type_id o
      case o
      when Chit_Chat
        Chit_Chat_Type_Id
      else
        raise "Unknown type: #{o.class}"
      end
    end

  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================


end # === class Comment ===





