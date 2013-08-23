
class Screen_Name

S.untrash = function (id, flow) {
  Topogo.new(TABLE_NAME)
  .untrash(id, flow);
};

S.trash = function (id, flow) {
  Topogo.new(TABLE_NAME)
  .trash(id, flow);
};

S.delete_trashed = function (flow) {
  Topogo.new(TABLE_NAME)
  .delete_trashed(flow);
};

S.delete_by_owner_ids = function (arr, flow) {
  var sql = "DELETE FROM \"" + TABLE_NAME + "\" WHERE owner_id IN ( " +
    _.map(arr, function (n, i) { return "$" + (i + 1); }).join(', ') +
    " ) RETURNING * ;";

  Topogo
  .run(sql, arr, flow);
};




end # === class Screen_Name trash ===





