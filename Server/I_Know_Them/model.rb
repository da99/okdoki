
require './Server/Okdoki/model'

require_crutd :I_Know_Them

class I_Know_Them

  include Okdoki::Model


  # =====================================================
  # Settings
  # =====================================================


  # =====================================================
  # Class
  # =====================================================

  class << self
  end # === class self ===

  # =====================================================
  # Instance
  # =====================================================

  def initialize *args
    if args.size == 3
      @target = args.pop
      @owner = args.pop
      super(*args)
    else
      super
    end
  end

end # === class I_Know_Them ===





