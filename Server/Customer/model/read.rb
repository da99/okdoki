
class Customer

  def read
    raise "Not finished."
  end # === def read

  def read_screen_names
    id = data[:id]

    names = TABLE[owner_id: id]

    raise Invalid.new(self, "No screen names found for customer id: #{id}") if names.empty?

    data[:screen_name_rows] = nil

    names.each do |k, v|
      screen_names.push v
    end

    self
  end

end # === class Customer read ===





