
require './Server/Ok/model'

class Customer

  include Ok::Model
  extend Ok::Model_Extend

  # =====================================================
  # Errors
  # =====================================================


  # =====================================================
  # Settings
  # =====================================================

  Jam = Jam_Func.new

  Jam.on 'test', lambda { |o| o[:Customer] = true }

  # =====================================================
  # Class
  # =====================================================

  # class << self
  # end # === class self

end # === Customer
