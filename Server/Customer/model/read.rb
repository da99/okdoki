class Customer

  class << self

    def read_by_id id
      new TABLE.limit(1)[id: id]
    end # === def

    def read_by_screen_name name
      sn = Screen_Name.read_by_screen_name(name)
      Customer.read_by_id(sn.data[:owner_id])
    end # === def


    def read_by_screen_name_and_pass_word screen_name, pass_word, ip

      # === Check if too many bad attempts by ip address.
      ip_row = Log_In_By_IP.create_or_read_by_ip ip

      begin
        c = read_by_screen_name(screen_name)
      rescue Screen_Name::Not_Found => e
        ip_row.inc_bad_log_in_count
        raise e
      end

      # === Update old attempt by screen name
      new_attempt_for_today = TABLE.
        returning.
        where("log_in_at != ? AND id = ?", Ok::Model::PG::UTC_NOW_DATE, c.data[:id]).
        update(log_in_at: Ok::Model::PG::UTC_NOW_DATE, bad_log_in_count: 0).
        first

      if new_attempt_for_today
        c.data.merge! new_attempt_for_today
      else
        if c.too_many_bad_logins?
          raise Too_Many_Bad_Logins.new(c, 'Too many bad log-ins for today. Try again tomorrow.')
        end
      end

      # === Check if password is correct.
      #     Record bad attempt if incorrect.
      bad_login = TABLE.
        returning.
        where(" id = ? AND pswd_hash != ? ", c.data[:id], c.decode_pass_word(pass_word)).
        update(" bad_log_in_count = (bad_log_in_count + 1) ").
        first


      if bad_login
        ip_row.inc_bad_log_in_count
        raise Wrong_Pass_Word.new(c, 'Pass phrase is incorrect. Check your CAPS LOCK key.')
      end

      c
    end # === def login

  end # === class self ===

  def too_many_bad_logins?
    data[:bad_log_in_count] > 3
  end

  def href
    screen_names.first.href
  end

  def bots
    []
  end

  def bot_uses
    []
  end

  def screen_names cmd = nil
    if cmd
      @screen_names.list.map(&cmd)
    else
      @screen_names
    end
  end

end # === class Customer read ===





