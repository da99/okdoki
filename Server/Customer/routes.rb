


post '/Customer' do
  begin
    Customer.create(params)
  rescue Screen_Name::Dup => err
    json false, err.msg
  rescue Customer::Invalid => err
    json false, err.msg
  end
end # === post Customer
