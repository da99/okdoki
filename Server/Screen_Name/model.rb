
require './Server/Ok/model'

require_crutd :Screen_Name

class Screen_Name

  include Ok::Model
  extend Ok::Model_Extend

  # =====================================================
  # Errors
  # =====================================================

  class Dup < Ok::Invalid
  end

  class Invalid < Ok::Invalid
  end

  # =====================================================
  # Settings
  # =====================================================


  BEGIN_AT_OR_HASH    = /^(\@|\#)/
  ALL_WHITE_SPACE     = /\s+/
  VALID_CHARS         = "a-zA-Z0-9\\-\\_\\."
  VALID               = /^[#{VALID_CHARS}]{4,15}$/i
  VALID_ENGLISH       = "Screen name must be: 4-15 valid chars: 0-9 a-z A-Z _ - ."
  INVALID             = /[^#{VALID_CHARS}]/
  Table_Name          = :screen_name
  TABLE               = DB[Table_Name]
  BANNED_SCREEN_NAMES = [
    /^MEGAUNI/i,
    /^MINIUNI/i,
    /^OKDOKI/i,
    /^(ME|MINE|MY|MI|i)$/i,
    /^PET-/i,
    /^BOT-/i,
    /^(ONLINE|CONTACT|INFO|OFFICIAL|ABOUT|NEWS|HOME)$/i,
    /^(UNDEFINED|DEF|SEX|SEXY|XXX|TED|LARRY)$/i,
    /^[.]+-COLA$/i
  ]

  # =====================================================
  # Helpers
  # =====================================================

  class << self

    def filter sn
      sn.gsub(INVALID, "")
    end

    def canonize_screen_name str
      return str unless str

      if (str.trim)
        str = str.trim();
      else
        str = $.trim(str);
      end

      sn = str.toUpperCase().replace(BEGIN_AT_OR_HASH, '').replace(ALL_WHITE_SPACE, '-');

      if (sn.indexOf('@') > 0)
        var temp = sn.split('@');
        sn = temp.pop().toUpperCase();

        while not temp.empty?
          sn = temp.pop.downcase + '@' + sn
        end
      end

      return sn;

    end # === def canonize_screen_name

  end # === class self ==================================

  def to_url *args
    raw_sn = args.shift()
    sn = self.class.filter(raw_sn)
    return nil if !sn.empty?

    args.unshift(sn)
    args.unshift('/me')
    File.join(*args)
  end

  # =====================================================
  # Class
  # =====================================================


  # =====================================================
  # Instance
  # =====================================================

  def validate *args
    if args.first == :screen_name
      super(*args).
        clean('strip', 'upcase').
        required().
        match(VALID, VALID_ENGLISH).
        not_match(BANNED_SCREEN_NAMES, 'Screen name not allowed.')
    elsif args.first == :type_id
      super(*args).
        clean('to_i').
        set_to(0, lambda { |v| v < 0 || v > 2 })
    elsif args.first == :about
      super(*args).is_null_if_empty
    else
      super
    end
  end

end # === Screen_Name ========================================











