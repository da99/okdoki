
require "./Server/Ok/Escape_All"

class Fake_Mustache

  CACHE = {}

  def escapeHTML var
    Ok::Escape_All.e(var.to_s)
  end

  def initialize raw_file, data
    file       = "Public/#{raw_file}/markup.mustache.rb"
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

end # === class

