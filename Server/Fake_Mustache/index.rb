
require "sanitize"

class Fake_Mustache

  CACHE = {}

  def initialize file, data
    @data      = data
    @file_name = file
    @file      = self.class::CACHE[file]
    if !@file
      @file = self.class::CACHE[file] = File.read(file)
    end
  end

  def [] key
    @data[key]
  end

  def render
    ctx = self
    instance_eval @file, @file_name, 1
  end

  def escapeHTML var
    Sanitize.clean(var.to_s)
  end

end # === class

