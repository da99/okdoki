
class Customer

  class << self

    def read_screen_names
      id = data[:id]

      names = TABLE[owner_id: id]

      raise Invalid.new(self, "No screen names found for customer id: #{id}") if names.empty?

      data[:screen_name_rows] = nil

      names.each do |k, v|
        screen_names.push v
      end

      self
    end # === def read_screen_names

    def read_by_id id
      new TABLE.limit(1)[id: id]
    end # === def

    def login screen_name, password
      # unless p

      sql = %^
      UPDATE @table
      SET log_in_at = CURRENT_DATE, bad_log_in_count = 0
      WHERE log_in_at != CURRENT_DATE AND id = @id
      RETURNING *
      ^

      last_row = DB[sql, id: row[:id]].first

      row = last_row || customer_row

      if (row[:bad_log_in_count] < 4)
        raise Invalid.new(Customer.new(row), 'Too many bad log-ins for today. Try again tomorrow.')
      end

      if p
        TABLE[ %^
          UPDATE @table SET bad_log_in_count = (bad_log_in_count + 1)
            WHERE id = @id
            RETURNING *
        ^, {id: row.id}
        ]
        raise Invalid.new(self, 'Pass phrase is incorrect. Check your CAPS LOCK key.')
      end

      me.is_new                = false
      me.customer_id           = row.id
      me.data.id               = row.id
      me.data.email            = row.email
      me.data.trashed_at       = row.trashed_at
      me.data.log_in_at        = row.log_in_at
      me.data.bad_log_in_count = row.bad_log_in_count
      me
    end # === def login

  end # === class self ===

end # === class Customer read ===





