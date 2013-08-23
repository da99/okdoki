
module Ok

  class Validate

    attr_reader :model, :name, :english_name, :clean_data

    def initialize model, name
      @e            = model.class::Invalid
      @model        = model
      @name         = name
      @english_name = @name.to_s.capitalize.gsub('_', ' ')
      @clean_data   = model.clean_data
      clean_data[name] = model.new_data[name]
    end

    def e msg = nil
      @e.new(model, msg || "#{@english_name} is invalid.")
    end

    #
    # Applies only to Strings or Arrays.
    # Ensures value has been set and not:
    #   String.strip.empty? && Array.empty?
    #
    def required msg = nil
      val = clean_data[name]
      raise "Must be string or array: #{val}" unless val.respond_to?(:size)
      is_empty = (val.kind_of?(String) && val.strip.empty?) || val.empty?
      raise e(msg || "#{english_name} is required." ) if is_empty
    end

    def clean *args
      args.each { |a|
        case a
        when 'strip'
          clean_data[name] = (clean_data[name] || "").strip
        when 'upper'
          clean_data[name] = clean_data[name].upcase
        when 'to_i'
          clean_data[name] = clean_data[name].to_i
        else
          raise "Unknown clean: #{a}"
        end
      }

      self
    end # === def

    def set_to val, func = nil
      if func
        (clean_data[name] = val) if func.call(clean_data[name])
      else
        clean_data[name] = val
      end

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
        raise e(msg) if model.clean_data[name].match(p)
      }

      self
    end

    def match pats, msg = nil
      if !pats.kind_of? Array
        pats = [pats]
      end

      pats.each { |p|
        raise e(msg) unless model.clean_data[name].match(p)
      }
      self
    end

  end # === class Validate

  class Validate_Empty

    meths = Validate.public_instance_methods - Object.public_instance_methods

    meths.each { |meth|
      case meth
      when :required
      else
        class_eval %!
          def #{meth} *args
            self
          end
        !
      end
    }

  end # === class Validate_Empty

end # === module Ok
