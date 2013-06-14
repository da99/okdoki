
var _         = require('underscore')
;


exports.route = function (mod) {
  var app = mod.app;

  app.post('/me/:screen_name/folder', function (req, resp, next) {
    var num = parseInt(Math.random() * 10)
    resp.json({success: true, msg: "Folder was created.", location: "/me/" + req.params.screen_name + "/folder/" + num, title: req.body.title});
  });

  app.get('/me/:screen_name/folder/:num', function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var num           = parseInt(req.params.num);
    var opts          = OK.template_data('Folder/show_one')
    opts['title']     = "Folder #" + num;
    opts['name']      = req.params.num;
    opts['about']     = "Stuff about #" + num;
    opts['folder_id'] = num;
    opts['website_location'] = "/me/GO99";
    opts['website_title']    = "The life of: GO99";
    opts['pages']     = [
      { location: "/me/GO99/folder/1/page/3",
      created_at: (new Date).getTime(),
      title: "Page 3"},
      { location: "/me/GO99/folder/1/page/2",
      created_at: (new Date).getTime(),
      title: "Page 2"},
      { location: "/me/GO99/folder/1/page/1",
      created_at: (new Date).getTime(),
      title: "Page 1"}
    ];
    return OK.render_template();
  });


  app.get("/me/:screen_name/folder/:num/page/:page_num", function (i) {
    var req           = i.req, resp = i.resp;
    var num           = parseInt(req.params.num);
    var page_num      = parseInt(req.params.page_num);
    var opts          = Views.default_opts('Folders/page', req, resp)
    opts['title']     = "Page #" + page_num;
    opts['page_num']  = page_num;
    opts['folder_id'] = num;
    opts['items']     = _.map("Item 0,Item 1,Item 2 dsdf sfsdf sdfdsdf sfsdf sdfdsdf sfsdf sdf  dsdf sfsdf sdfdsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf dsdf sfsdf sdf   ,Item 3".split(','), function (v, i) {
      if (i == 2)
        return ['Title 3', v];
      return [null, v];
    });
    return i.template(opts);
  });

  app.post("/me/:screen_name/folder/:num/page", function (req, resp, next) {
    var o      = _.clone(req.body);
    var num    = parseInt(Math.random() * 10)
    o.location = "/me/" + req.params.screen_name + "/folder/" + req.params.num + '/page/' + num;
    o.created_at = (new Date).getTime();
    resp.json({success: true, msg: 'Created: ' + req.body.title, record: o});
  });

  app.post('/me/:screen_name/folder/:num/page/:page_num/create/text', function (req, resp, next) {
    var o = _.clone(req.body);
    if (!o.title.trim().length)
      o.title = null;
    resp.json({success: true, msg: 'Created: new text', record: [o.title, o.body]});
  });

}; // route
