
class Notify

  class << self

    def read_inbox sn
      new TABLE
      .where(:to_id=>sn.id)
      .and(Sequel.lit("((last_read_at IS NULL OR updated_at IS NULL) OR (updated_at > last_read_at))"))
      .order_by(Sequel.lit("updated_at DESC, created_at DESC"))
      .all
    end

  end # === class self

end # === class Notify read ===





