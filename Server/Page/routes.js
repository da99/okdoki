
var _       = require("underscore")
  , Page    = require("./model").Page
  , Folder  = require("../Folder/model").Folder
  , Website = require("../Website/model").Website
  , Screen_Name = require("../Screen_Name/model").Screen_Name
  , Bling_Bling = require("bling_bling").Bling_Bling
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ CREATE ===============================================
  app.post("/me/:screen_name/folder/:folder_num/page", function (req, resp, next) {
    var data = _.clone(req.body);
    data.author_id = req.body.life_id;

    mod
    .New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .read_one('folder', function (j, website) {
      Folder.read_by_website_and_num(website, req.params.folder_num, j);
    })
    .create_one('page', function (j, folder) {
      Page.create_in_folder(folder, data, j);
    })
    .job('fin', function (j, page) {
      resp.json({
        success : true,
        msg     : 'Created: ' + page.data.title,
        page    : page.data,
        location: "/me/" + req.params.screen_name + "/folder/" + req.params.folder_num + '/page/' + page.data.num
      });
    })
    .run();
  });

  app.post('/me/:screen_name/folder/:num/page/:page_num/create/text', function (req, resp, next) {
    var o = _.clone(req.body);
    if (!o.title.trim().length)
      o.title = null;
    resp.json({success: true, msg: 'Created: new text', record: [o.title, o.body]});
  });

  // ============ READ =================================================
  app.get("/me/:screen_name/folder/:folder_num/page/:page_num", function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var folder_num    = parseInt(req.params.folder_num);
    var page_num      = parseInt(req.params.page_num);
    var sn            = req.params.screen_name;

    mod.New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(sn, req.user, j);
    })
    .read_one('website', function (j, screen_name) {
      Website.read_by_screen_name(screen_name, j);
    })
    .read_one('folder', function (j, website) {
      Folder.read_by_website_and_num(website, folder_num, j);
    })
    .read_one('page', function (j, folder) {
      Page.read_by_folder_and_num(folder, page_num, j);
    })
    .run(function (fin, page) {
      if (!page)
        return next();
      var opts          = OK.template_data('Page/show');
      opts['title']     = page.data.title;
      opts['page']      = page.to_client_side();
      opts['page_num']  = page.data.num;
      opts['folder_num'] = page.folder().data.num;
      opts['folder_title'] = page.folder().data.title;
      opts['is_update_able'] = page.is_update_able();
      opts['page_body'] = page.data.body;
      opts['page_body_html'] = Bling_Bling.new(opts['page_body']).to_html();
      return OK.render_template();
    });
  });

  // ================== UPDATE ======================================
  app.put("/me/:screen_name/folder/:folder_num/page/:page_num", function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var folder_num    = parseInt(req.params.folder_num);
    var page_num      = parseInt(req.params.page_num);
    var sn            = req.params.screen_name;

    mod.New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(sn, req.user, j);
    })
    .read_one('website', function (j, screen_name) {
      Website.read_by_screen_name(screen_name, j);
    })
    .read_one('folder', function (j, website) {
      Folder.read_by_website_and_num(website, folder_num, j);
    })
    .read_one('page', function (j, folder) {
      Page.read_by_folder_and_num(folder, page_num, j);
    })
    .update_one('page', function (j, page) {
      page.update(req.body, j);
    })
    .run(function (fin, page) {
      if (!page)
        return next();
      var data = page.to_client_side();
      data.body_html = Bling_Bling.new(page.data.body).to_html();
      resp.json({success: true, msg: "Page has been updated.", page: data});
    });
  });


}; // ==== exports.routes




