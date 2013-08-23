
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

  def create new_vals, flow
    @new_data = new_vals

    sn = Screen_Name.create(new_vals)

    validate(:ip)
    validate(:password)
    validate(:confirm_password)
    clean_data[:id] = sn.data[:owner_id]

    DB.brcyot_pswd
    rec = TABLE.returning.insert(clean_data).first

    @data.merge! rec

    self
  end # === create


end # === Customer


