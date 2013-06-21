
var _       = require("underscore")
  , Page    = require("./model").Page
  , Folder  = require("../Folder/model").Folder
  , Website = require("../Website/model").Website
  , Screen_Name = require("../Screen_Name/model").Screen_Name
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
        page    : page,
        location: "/me/" + req.params.screen_name + "/folder/" + req.params.num + '/page/' + num
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
  app.get("/me/:screen_name/folder/:num/page/:page_num", function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var num           = parseInt(req.params.num);
    var page_num      = parseInt(req.params.page_num);
    var opts          = OK.template_data('Folder/page');
    opts['title']     = "Page #" + page_num;
    opts['page_num']  = page_num;
    opts['folder_id'] = num;
    opts['about']     = "ABOUT---";
    opts['item']      = "Section: Intro\nHello\nBye.\nSection: Links\nThis is *a link* [okdoki.com]." +
      "\nThis is *bold*.\n" +
      "\nThis is /italic/.";

    return OK.render_template();
  });

}; // ==== exports.routes




