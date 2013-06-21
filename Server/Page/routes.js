
var _ = require("underscore")
Page = require("./model").Page
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ CREATE ===============================================
  app.post("/page", function (req, resp, next) {
    var data = _.clone(req.body);
    data.author_id = req.body.life_id;

    mod
    .New_River(req, resp, next)
    .job(function (j) {
      Website.read_by_screen_name_and
    })
    .job(function (j) {
      Page.create(data, j);
    })
    .job(function (j, page) {
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




