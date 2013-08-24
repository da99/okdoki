
require './Server/Ok/model'
require './Server/Screen_Name/model'

require_crutd :Customer

class Customer

  include Ok::Model

  # =====================================================
  # Settings
  # =====================================================

  Table_Name = :customer
  TABLE = DB[Table_Name]

  # =====================================================
  # Errors
  # =====================================================


  # =====================================================
  # Class
  # =====================================================

  class << self

    def read_by_screen_name opts
      if opts.kind_of? String
        opts = {:screen_name => opts}
      end

      sn = Screen_Name.read_by_screen_name(opts)

      c_opts = {
        :id=>sn.data.id,
        :screen_name=>opts[:screen_name],
        :password=>opts[:pass_phrase]
      }

      Customer.read_by_id(c_opts)
    end # === def

  end # === class self

  # =====================================================
  # Instance
  # =====================================================

  attr_reader :screen_names

  def initialize *args
    @screen_names = Screen_Name::List.new()
    super
  end

  def validate name
    case name
    when :pass_phrase
      super(name).
        between(6, 100).
        be(lambda { |v| v.size > 6 }, 'Pass phrase must be two words or more... with spaces.')
    when :confirm_pass_phrase
      super.
      equals(clean_data[:pass_phrase], "Pass phrase is different than pass phrase confirmation.")
    when :email
      raise "not ready"
    when :ip
      super.
        not_empty('IP address is required.').
        be(lambda { |v| v > 5 }, 'Valid ip address is required.')
    else
      super
    end # === case
  end # === def validate

  def is? var
    screen_names.include? var
  end

end # === Customer


