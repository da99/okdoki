
class Screen_Name

  class List # === Not called an Array to avoid confusion.

    include Ok::Model::List

    def initialize arr = nil
      @names = arr || []
    end # === def initialize

    def names
      pluck :screen_name
    end

    def ids
      pluck :id
    end

  end # === class List ===

end # === class Screen_Name ===
