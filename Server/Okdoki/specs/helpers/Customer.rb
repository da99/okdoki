
require './Server/Customer/model'

module Customer_Test

  PSWD = "this is a pass"

  def create_customer
    sn = new_name
    c = Customer.create screen_name: sn,
      pass_word: PSWD,
      confirm_pass_word: "this is a pass",
      ip: '000.00.000'
    {c: c, sn: Screen_Name.read_by_screen_name(sn), pw: "this is a pass"}
  end

  def find_customer n = 0
    rec = Customer::TABLE.order_by(:id).limit(1, n).last

    c   = Customer.new(rec)
    sn  = Screen_Name.new(Screen_Name::TABLE[owner_id: c.id, is_sub: false])
    {c: c, sn: sn, pw: PSWD}
  end

  class << self
    include Customer_Test
  end

end # === module Customer_Test ===

