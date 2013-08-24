
require './Server/Screen_Name/model'
require './Server/Customer/model'
require 'Bacon_Colored'

def customer
  Customer.new(:data)
end

def new_name
  @i ||= Screen_Name::TABLE.count
  @i += 1
  "ted_#{@i}"
end

def less_than x
  lambda { |o| o < x }
end

def within_secs x
  lambda { |o| (Time.now.utc.to_i - o.to_i).abs < x }
end
