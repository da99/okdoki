
require './Server/Ok/model'
require 'Jam_Func'

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


  Jam = Jam_Func.new
  VALID_CHARS       = "a-zA-Z0-9\\-\\_\\."
  VALID             = /^[#{VALID_CHARS}]{4,15}$/i
  VALID_ENGLISH     = "Screen name must be: 4-15 valid chars: 0-9 a-z A-Z _ - ."
  INVALID           = /[^#{VALID_CHARS}]/
  Table_Name        = :screen_name
  TABLE             = DB[Table_Name]
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

  end # === class self ==================================

  def to_url *args
    raw_sn = args.shift()
    sn = self.class.filter(raw_sn)
    return null if !sn.size

    args.unshift(sn)
    args.unshift('/me')
    args.join('/')
  end

  # =====================================================
  # Class
  # =====================================================


  # =====================================================
  # Instance
  # =====================================================

  def create raw_data
    # === Validate the data.
    @new_data = raw_data
    @clean_data = {}

    validate(:screen_name)

    validate(:type_id)

    insert_data = {
       :owner_id     => new_data[:customer] ? new_data[:customer].data.id : 0,
       :screen_name  => clean_data[:screen_name],
       :display_name => clean_data[:screen_name],
       :type_id      => (clean_data[:type_id] || 0)
    }

    begin
      new_record = TABLE.returning.insert(insert_data).first
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"screen_name_screen_name_key"']
      raise self.class::Invalid.new(self, "Screen name already taken: #{clean_data[:screen_name]}")
    end

    #, 'screen_name', 'Screen name alread taken: ' + insert_data[:screen_name])

    @data.merge! new_record
    return self if new_data[:customer]


    # // ==== This is a new customer
    # // ==== so we must use the screen name id
    # // ==== as the owner_id because customer record
    # // ==== has not been created.
    TABLE.where(:id=>self.data[:id]).update(:owner_id=>self.data[:id])

    self
  end # === def create

  # // ================================================================
  # // =================== Update =====================================
  # // ================================================================

  def validate *args
    if args.first == :screen_name
      super(*args).
        clean('strip', 'upper').
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

  def update raw_data
    validate :screen_name
    validate :about
    validate :type_id
    validate(:nick_name)
      .set_to_nil_if_empty()

    # -------------------------------
    # === Update row in customer list
    # -------------------------------

  end # === def update

end # === Screen_Name ========================================











