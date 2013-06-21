
var _         = require('underscore')
, Folder      = require("../Folder/model").Folder
, Page        = require("../Page/model").Page
, Website     = require("../Website/model").Website
, Screen_Name = require("../Screen_Name/model").Screen_Name
;


exports.route = function (mod) {
  var app = mod.app;

  // ================== Create ======================================

  app.post('/folder', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job(function (j) {
      Folder.create({
        owner_id: req.user.data.id,
        title: req.body.title,
        website_id: req.body.website_id
      }, j);
    })
    .job(function (j, f) {
      resp.json({
        success: true,
        msg: "Folder was created.",
        title: f.data.title,
        num: f.data.num
      });
    })
    .run();
  });

  // ================== Read ========================================

  app.get('/me/:screen_name/folder/:num', function (req, resp, next) {
    var num  = parseInt(req.params.num);
    var OK   = mod.New_Request(req, resp, next);
    var opts = OK.template_data('Folder/show_one')
    var sn   = req.params.screen_name;

    mod
    .New_River(req, resp, next)
    .read_one('screen name', function (j) {
      Screen_Name.read_by_screen_name(sn, req.user, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .read_one('folder', function (j, website) {
      Folder.read_by_website_and_num( website, num, j);
    })
    .read_one('page list', function (j, folder) {
      Page.read_list_by_folder(folder, j);
    })
    .job('fin', function (j, page_arr) {
      if (!page_arr)
        return next();
      opts['folder']           = page_arr.folder;
      opts['title']            = page_arr.folder.data.title;
      opts['folder_num']       = num;
      opts['website_location'] = "/me/" + sn;
      opts['pages']            = page_arr;
        // { location: "/me/GO99/folder/1/page/3",
          // created_at: (new Date).getTime(),
          // title: "Page 3"},
      OK.render_template();
    })
    .run();
  });


}; // route
