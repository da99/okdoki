
class Customer

  def update new_data
    @new_data = new_data

    set = {}

    email.split(' ').each do |key, i|
      if clean_data.has_key?(key)
        set[key] = clean_data[key]
      end
    end

    TABLE.
      where(id: data[:id]).
      update(set)

    @data = r
    self
  end # === def update

end # === class Customer update ===





