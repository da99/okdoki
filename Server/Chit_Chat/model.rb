#
#  Chit_Chat:
#    Holds all no/low-priority conversations for a Screen_Name.
#    They are meant to be seen by one or more people.
#    In other words, they are semi-private.
#
#    Notifications from other apps are meant to go to Mail,
#    because they are meant to be only seen *only* by the
#    Screen_Name.
#
#
#
#

require './Server/Ok/model'

require_crutd :Chit_Chat

class Chit_Chat

  include Ok::Model


  # =====================================================
  # Settings
  # =====================================================

  Create_Limit    = 44

  Table_Name      = :chit_chat
  TABLE           = DB[Table_Name]

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def initialize *args
    super
  end


end # === class Chit_Chat ===





