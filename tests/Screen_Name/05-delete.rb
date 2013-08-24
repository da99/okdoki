
describe 'delete' do

  before do
    create_test_customer
    create_test_customer
  end

  it 'it deletes screen-name record of more than 2 days old' do
    id = c.screen_name_id(sn)

    Screen_Name::TABLE.where(:id=>id).update(:trashed_at=>h.ago('-3d'))
    Screen_Name.delete_trashed()
    last = Customer.read_by_id(c.datta[:id])

    last.screen_names.size.should.equal 0
  end # === it

end # === describe delete

