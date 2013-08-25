
CREATE INDEX chit_chat_from_to  ON  chit_chat  ( from_id,  from_type,  to_id  );
CREATE INDEX chit_chat_to_from  ON  chit_chat  ( to_id,    from_id,    from_type );

-- DOWN



