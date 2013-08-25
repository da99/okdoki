
class Screen_Name

  class List # === Not called an Array to avoid confusion.

    include Ok::Model::List

    def initialize var = nil
      @customer = nil
      @list     = []

      case var
      when Customer
        @customer = var
        @list     = Screen_Name.read_by_customer(var)
      when Array
        @list = var
      end
    end # === def initialize

    def include? unknown
      name = if unknown.is_a? String
        unknown
      else
        unknown.data[:screen_name]
      end

      !!@list.detect { |sn| sn.is? name }
    end

    def [] raw_name
      @list.detect { |sn| sn.is? raw_name }
    end

    def names
      pluck :screen_name
    end

    def ids
      pluck :id
    end

  end # === class List ===

end # === class Screen_Name ===
