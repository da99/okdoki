
class Customer

  Jam = Jam_Func.new

  Jam.on 'test', lambda { |o| o[:Customer] = true }

end # === Customer
