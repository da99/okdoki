
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

end # === module Customer_Test ===

