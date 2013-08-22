
module Ok
  class Invalid < RuntimeError

    attr_reader :model, :msg

    def initialize o, msg
      @model = o
      @msg   = msg
      super(msg)
    end

  end

  module Model_Extend

    def create new_data
      m = new
      m.create new_data
      m
    end

  end # === module

  module Model

    attr_reader :clean_data, :new_data

    def spec name
      @spec = name
      Validator.new(self, name)
    end

    def initialize data = nil
      @data = data || {}
    end

  end # === module

  class Validator

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

    def be req, msg = nil
      case req
      when'not empty'

        val = clean_data[name]
        raise "Must be string or array: #{val}" unless val.respond_to?(:size)
        is_empty = (val.kind_of?(String) && val.strip.empty?) || val.empty?
        raise e(msg || "#{english_name} may not be empty." ) if is_empty
      else
        raise "Unknown request: #{name}"
      end

      self
    end # === def

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

  end # === class
end # === module Ok
