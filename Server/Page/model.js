
var _ = require("underscore")
Folder = require("../Folder/model").Folder
Ok_Model = require("../Ok/model").Model
Topogo = require("topogo").Topogo
River  = require("da_river").River
;


var P = exports.Page = Ok_Model.new(function () {});
var Page = P;
var TABLE_NAME = P.TABLE_NAME = "Page";
var TABLE = Topogo.new(TABLE_NAME);

Page.new = function (data, folder) {
  var p = new P();
  p.data = data;
  p.folder(folder);
  return p
};

function null_if_empty(str) {
  if (!str) return null;
  str = str.trim();
  if (!str.length)
    return null;
  return str;
}

Page.prototype.folder = function (f) {
  if (f)
    this._folder = f;
  return this._folder;
};

Page.prototype.is_readable_by = function (customer) {
  throw new Error("not imolemented");
};

Page.prototype.is_update_able = function () {
  return _.contains( this.folder().website().screen_name().customer().screen_name_ids(), this.data.author_id) ||
   this.folder().is_update_able();
};

// ================================================================
// ================== Create ======================================
// ================================================================
Page.create_in_folder = function (folder, data, flow) {
  data.folder_id = folder.data.id;
  data.folder = folder;
  return Page.create(data, flow);
};

Page.create = function (raw_data, flow) {
  var data = {
    folder_id: raw_data.folder_id || 1,
    author_id: raw_data.author_id || 0,
    title : null_if_empty(raw_data.title) || "[Unknown Title]",
    body  : null_if_empty(raw_data.body)  || "[Blank Page]"
  };

  if (!data.author_id)
    return flow.finish('invalid', "Invalid author id.");

  var sql = "\
    WITH next_num AS (                        \n\
       SELECT coalesce(MAX(num),0) + 1 as num \n\
       FROM @table                            \n\
       WHERE folder_id = @folder_id           \n\
    )                                         \n\
    INSERT INTO @table (num, folder_id, author_id, title, body) \n\
    VALUES( (SELECT num FROM next_num) , @folder_id, @author_id, @title, @body ) \n\
    RETURNING * ;";

  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, data, j);
  })
  .job(function (j, rows) {
    console.log(rows)
    if (!rows[0])
      return j.finish();
    return j.finish(Page.new(rows[0], raw_data.folder));
  })
  .run();
};


// ================================================================
// ================== Read ========================================
// ================================================================

Page.prototype.public_data = function () {
  return this.get_data('title', 'body', 'created_at', 'updated_at', 'trashed_at');
};

Page.read_list_by_folder = function (folder, flow) {
  River.new(flow)
  .job(function (j) {
    var vals = {
      TABLES: {
        P: TABLE_NAME
      },
      f_id: folder.data.id,
      sn_ids: folder.website().screen_name().customer()
    };

    var sql = "\
    SELECT                                          \n\
      @P.*                                          \n\
    FROM                                            \n\
      @P                                            \n\
    WHERE                                           \n\
      @is_read_able                                 \n\
      AND folder_id = @f_id                         \n\
    ORDER BY id DESC;";

    TABLE.run(sql, vals, j);
  })
  .job(function (j, pages) {
    folder.data.pages = _.map(pages, function (p) { return Page.new(p, folder); });
    j.finish({list: folder.data.pages, folder: folder});
  })
  .run();

}; // ==== end read_list_by_folder_id

Page.read_by_folder_and_num = function (folder, page_num, flow) {
  var data = {
    folder_id: folder.data.id,
    page_num: page_num,
    sn_ids: folder.website().screen_name().customer(),
    TABLES: {
      P: TABLE_NAME
    }
  };
  var sql = "\
    SELECT @P.*                          \n\
    FROM @P                            \n\
    WHERE                                    \n\
      @is_read_able  AND                     \n\
      @P.folder_id = @folder_id AND          \n\
      @P.num     = @page_num                 \n\
    LIMIT 1                                  \n\
  ;";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, data, j);
  })
  .job(function (j, rows) {
    j.finish(rows[0] && Page.new(rows[0], folder));
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================
Page.prototype._update = function (raw_data, flow) {
  console.log(raw_data)
  var me = this;
  var data = {
    title: raw_data.title,
    body: raw_data.body
  };

  River.new(flow)
  .job(function (j) {
    TABLE.update({id: me.data.id}, data, j);
  })
  .job(function (j, row) {
    if (row)
      me.data = row;
    j.finish(row && me);
  })
  .run();
};

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================
















