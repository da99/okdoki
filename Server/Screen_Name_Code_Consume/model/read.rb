
class Screen_Name_Code_Consume

  class << self

    def read_for_consume producer, consumer
      prod_id = producer.id
      prod_class_id = producer.class.okdoki_id
      cons_id = consumer.id
      cons_class_id = consumer.class.okdoki_id

      sql = %~

        -- FIRST: get 'subscriptions' of producer

        SELECT *
        FROM screen_name_code
        WHERE
          is_on IS TRUE
          AND
          event_name_id = :EV_NAME_ID
          AND
          screen_name_id IN (
            SELECT producer_id
            FROM screen_name_code_consume
            WHERE
              is_on IS TRUE
              AND
              consumer_id = :PROD_ID
              AND
              consumer_class_id = :PROD_CLASS_ID
          )
          -- IF this is content (story, product, note, etc)
          -- check that parent SN and Customer
          -- have this subsribed.

        UNION DISTINCT

        -- SECOND: get 'subscriptions' of consumer

        SELECT *
        FROM screen_name_code
        WHERE
          is_on IS TRUE
          AND
          event_name_id = :EV_NAME_ID
          AND
          screen_name_id IN (
            SELECT producer_id
            FROM screen_name_code_consume
            WHERE
              is_on IS TRUE
              AND
              consumer_id = :CONS_ID
              AND
              consumer_class_id = :CONS_CLASS_ID
          )

      ~
    end

  end # === class self ===

  def producer_id
    data[:producer_id]
  end

  def consumer_id
    data[:consumer_id]
  end

end # === class Screen_Name_Code_Consume read ===





