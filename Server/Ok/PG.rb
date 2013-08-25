

module Ok
  module Model
    module PG
      UTC_NOW      = ::Sequel.lit("timezone('UTC'::text, now()")
      UTC_NOW_DATE = ::Sequel.lit("CURRENT_DATE")
    end # === module Sequel ===
  end # === module Model ===
end # === module Ok ===
