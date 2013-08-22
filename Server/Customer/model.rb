
require './Server/Ok/model'

class Customer

  # =====================================================
  # Errors
  # =====================================================

  class Invalid < Ok::Invalid
  end

  Jam = Jam_Func.new

  Jam.on 'test', lambda { |o| o[:Customer] = true }

  # =====================================================
  # Class
  # =====================================================

  class << self

    def create o
      c = new
      raise Customer::Invalid.new(c, "Not ready")
    end

  end # === class self

end # === Customer
