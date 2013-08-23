
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


  SCREEN_NAME_KEYS    = [:screen_name_id, :publisher_id, :owner_id, :author_id, :follower_id]
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

      sn = str.strip.upcase.gsub(BEGIN_AT_OR_HASH, '').gsub(ALL_WHITE_SPACE, '-');

      if sn.index('@') > 0
        temp = sn.split('@');
        sn = temp.pop.upcase

        while not temp.empty?
          sn = temp.pop.downcase + '@' + sn
        end
      end

      sn
    end # === def canonize_screen_name

  end # === class self ==================================

  def to_url *args
    raw_sn = args.shift
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
    case args.first
    when :screen_name
      super(*args).
        clean('strip', 'upcase').
        required().
        match(VALID, VALID_ENGLISH).
        not_match(BANNED_SCREEN_NAMES, 'Screen name not allowed.')
    when :type_id
      super(*args).
        clean('to_i').
        set_to(0, lambda { |v| v < 0 || v > 2 })
    when :about
      super(*args).is_null_if_empty
    else
      super
    end
  end

  def find_screen_name_keys arr
    rec     = arr[0] || {:screen_name_id=>nil}
    key     = SCREEN_NAME_KEYS.detect { |k| rec.has_key? k }
    key     = key || :screen_name_id
    new_key = key.to_s.sub('_id', '_screen_name').to_sym
    [key, new_key]
  end

  def attach_screen_names arr
    keys    = find_screen_name_keys(arr)
    key     = keys[0]
    new_key = keys[1]

    vals = arr.map { |v| v[key] }
    return [] if vals.empty?

    names = TABLE[id: vals]
    map = {}
    names.each { |n| map[n[:id]] = n[:screen_name] }

    arr.each do |r, i|
      arr[i][new_key] = map[arr[i][key]]
    end

    arr
  end

end # === Screen_Name ========================================











