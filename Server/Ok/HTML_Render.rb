
require "./Server/Ok/Escape_All"

helpers do

  def html view_name, o
    Fake_Mustache.new(view_name, o).render
  end

end # === helpers

class Fake_Mustache

  CACHE = {}

  def escapeHTML var
    Ok::Escape_All.e(var.to_s)
  end

  def initialize raw_file, data
    file       = "Public/#{raw_file}/markup.mustache.rb"
    @data      = data
    @file_name = file
    @file      = (self.class::CACHE[file] ||= File.read(file))
  end

  def [] key
    @data[key]
  end

  def render
    ctx = self
    instance_eval @file, @file_name, 1
  end

end # === class

