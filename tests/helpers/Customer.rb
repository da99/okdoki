
require './Server/Customer/model'
require './tests/helpers/Screen_Name'

module Customer_Test

  include Screen_Name_Test

  # def delete_all
    # Customer::TABLE.delete
    # Screen_Name::TABLE.delete
  # end

  def create_customer
    sn = new_name
    c = Customer.create screen_name: sn,
      pass_word: "this is a pass",
      confirm_pass_word: "this is a pass",
      ip: '000.00.000'
    {c: c, sn: sn, pw: "this is a pass"}
  end

  def find_customer n = 0
    rec = Customer::TABLE.order_by(:id).limit(n, 1).last
    c   = Customer.new(rec)
    sn  = Screen_Name.new(Screen_Name::TABLE[owner_id: c.id, is_sub: false])
    {c: c, sn: sn}
  end

end # === module Customer_Test ===

