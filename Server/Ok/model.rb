require 'sequel'
DB = Sequel.connect(ENV['DATABASE_URL'])

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

    attr_reader :data, :clean_data, :new_data

    def validate name, req
      @spec = name
      v = nil
      if clean_data.has_key?(name) || req
        v = Validator.new(self, name)
        v.not_empty() if req && !clean_data.has_key?(name)
      else
        v = Validator_Empty.new(self, name)
      end
      v
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

  end # === class Validator

  validator_meths = Validator.public_instance_methods - Object.public_instance_methods
  class Validator_Empty
    validator_meths.each { |meth|
      class_eval "
      def #{meth} *args
        self
      end
      "
    }
  end # === class


end # === module Ok






module Miscel

def add_leading_zero n
  (n = '0' + n;) if (n < 10)
  n
end

def date d
  m   = add_leading_zero(d.getUTCMonth() + 1);
  day = add_leading_zero(d.getUTCDate());
  d.getUTCFullYear() + '-' + m + '-' + day;
end # === def

def add_s v
  (v > 1 ? 's' : '')
end

def human_durs durs
  msg = []
  d = durs.day
  h = durs.hour
  m = durs.minute
  v = null

  if (d === 1 && h === 23 && m > 45)
    d = 2
    h = 0
    m = 0
  end

  v = d
  if (v > 0)
    msg.push( v + " day" + add_s(v) )
  end

  v = h
  if (v > 0)
    msg.push(v + " hr" + add_s(v))
  end

  v = m
  if (v > 0)
    msg.push(v + " min" + add_s(v))
  end

  msg.join(', ')
end # === def human_durs


end # === Miscel








