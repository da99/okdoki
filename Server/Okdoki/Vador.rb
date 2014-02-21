
module Okdoki

  class Vador

    class << self # =====================================

      def new o, name, new_data = {}

        # Symbol-ify the key name
        str_name = name.to_s
        if new_data.has_key?(str_name)
          new_data[name] = new_data[str_name]
          new_data.delete(str_name)
        end

        # If key/value exist, proceed normally.
        # else, create special dummy validator.
        if new_data.has_key?(name)
          super o, name, new_data
        else
          Okdoki::Vador_Empty.new(o, name, new_data)
        end
      end

    end # === class self ================================

    attr_reader :model, :name, :english_name

    def initialize model, name, data
      @model           = model
      @name            = name
      @english_name    = @name.to_s.capitalize.gsub('_', ' ')
      @clean_data      = data
      key = if model.new_data.has_key?(name.to_s)
              name.to_s
            else
              name
            end

      @clean_data[name]= model.new_data[key]
    end

    def data
      @clean_data
    end

    def invalid_new msg = nil
      model.class::Invalid.new(model, msg || "#{@english_name} is invalid.")
    end

    #
    # Applies only to Strings or Arrays.
    # Ensures value has been set and not:
    #   String.strip.empty? && Array.empty?
    #
    def required msg = nil
      val = clean_data[name]
      is_empty = !val || (val.kind_of?(String) && val.strip.empty?) || (val.respond_to?(:empty?) && val.empty?)
      raise invalid_new(msg || "#{english_name} is required." ) if is_empty

      self
    end

    # ===================================================
    IGNORE_METHODS = self.public_instance_methods
    # ===================================================

    #
    # Accepts: a lambda that must return TRUE or FALSE
    def be l, msg
      raise invalid_new(msg) unless (!! l.call(clean_data[name]))
      self
    end

    def clean *args
      args.each { |a|
        case a.to_s
        when 'strip'
          clean_data[name] = (clean_data[name] || "").strip
        when 'upcase'
          clean_data[name] = clean_data[name].upcase
        when 'to_i'
          clean_data[name] = clean_data[name].to_i
        else
          raise "Unknown operation for :clean : #{a}"
        end
      }

      self
    end # === def

    def at_most val, msg
      raise invalid_new(msg) if clean_data[name].size > val
      self
    end

    def at_least val, msg
      raise invalid_new(msg) if clean_data[name].size < val
      self
    end

    def set_to val, func = nil
      if func
        (clean_data[name] = val) if func.call(clean_data[name])
      else
        clean_data[name] = val
      end

      self
    end

    def set_to_integer
      clean_data[name] = Integer clean_data[name]
      self
    end

    def equals val, msg
      raise invalid_new(msg) if clean_data[name] != val
      self
    end

    def set_to_nil_if_empty val
      set_to(nil, lambda { |v|
        if v.kind_of? String
          v.strip.size == 0
        else
          v.size == 0
        end
      })
    end

    def not_match pats, msg = nil
      if !pats.kind_of? Array
        pats = [pats]
      end

      pats.each { |p|
        raise invalid_new(msg) if clean_data[name].match(p)
      }

      self
    end

    def in arr, msg = nil
      raise invalid_new(msg) unless arr.include?(clean_data[name])
      self
    end

    def match pats, msg = nil
      if !pats.kind_of? Array
        pats = [pats]
      end

      pats.each { |p|
        raise invalid_new(msg) unless clean_data[name].match(p)
      }
      self
    end

    def one_of_these arr, msg
      raise invalid_new(msg) unless arr.index(clean_data[name])
      self
    end

  end # === class Vador

  class Vador_Empty

    meths = Vador.public_instance_methods - Vador::IGNORE_METHODS

    meths.each { |meth|
      case meth
      else
        class_eval %!
          def #{meth} *args
            self
          end
        !
      end
    }

    def initialize model, name, data = {}
      @model = model
      @name  = name
      @clean_data = data
      super()
    end

    def required msg = nil
      raise @model::Invalid.new(@model, msg || "#{@name} is required.")
    end

  end # === class Vador_Empty

end # === module Okdoki

