
module Okdoki
  class SQL_Code

    CTE_COLS = {
      Story       => [:mag_id, Magazine].freeze,
      Magazine    => [:publisher_id, Screen_Name].freeze,
      Screen_Name => [:owner_id, Customer].freeze,
      Customer    => [nil, nil].freeze
    }

    SQL_Templates = [
      # === TOP
      %~
        SELECT ? AS class_id, id, NULL AS parent_id
        FROM :klass
        WHERE id IN ( SELECT parent_id FROM :child_klass_parent )
      ~.rstrip,

      # === MIDDLE
      %~
        SELECT ? AS class_id, id, ? AS parent_id
        FROM :klass
        WHERE id = ( SELECT parent_id FROM :child_klass_parent )
      ~.rstrip,

      # === BOTTOM
      %~
        SELECT ? AS class_id, id, ? AS parent_id
        FROM :klass
        WHERE id = :klass_table
      ~.rstrip
    ]

    def initialize klass, id
      @with   = []
      @sql    = []
      @record  = klass
      WITH(klass, id)
    end

    def to_sql
      sql        = []
      size       = @with.size
      last_index = size - 1
      selects    = []
      args       = []
      @with.each_with_index { |meta, i|
        klass        = meta[:klass]
        table_name   = klass.table_name.to_s
        child_klass  = @with[i + 1] && @with[i + 1][:klass]
        fkey_name    = meta[:fkey]
        parent_klass = meta[:parent_klass]
        id           = meta[:id]

        args.push klass.okdoki_id

        template     = if i == 0
                         SQL_Templates[0]
                       elsif i != last_index
                         args.push meta[:fkey].to_s
                         SQL_Templates[1]
                       else
                         args.push meta[:fkey].to_s
                         SQL_Templates[2]
                       end

        sql << %^
          :klass_parent AS (
            #{template}
          )
        ^.gsub(':klass', table_name)

        selects << %^
          SELECT class_id, id
          FROM :klass_parent
        ^.gsub(':klass', table_name)

        sql.last.gsub!(':child_klass', child_klass.table_name.to_s) if child_klass
      }

      sql_str = %^
        WITH
          #{sql.join ', '}
        ,
        :klass_parent_child_tree AS (
          #{selects.join '
            UNION
          '}
        )
      ^.gsub(':klass', @record.class.table_name.to_s)
      [sql_str, args]
    end

    # =======================================================
    private
    # =======================================================

    def WITH klass, id
      klass = (CTE_COLS[klass] && klass) || (CTE_COLS[klass.class] && klass.class)
      @with.unshift({
        :fkey         => CTE_COLS[klass][0],
        :parent_klass => CTE_COLS[klass][1],
        :klass        => klass,
        :id           => id
      })
      parent = @with.first[:parent_klass]
      WITH(parent, :unknown) if parent
      self
    end

    def SUB_SELECT col, table
      " SELECT '#{col}' FROM '#{table}' "
    end

  end # === class SQL_Code ===
end # === module Okdoki ===
