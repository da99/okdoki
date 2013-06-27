
var _ = require("underscore")
MODEL = require("./model").MODEL
;

exports.routes = function (mod) {
  var app = mod.app;

  // ============ READ =================================================
  app.get("/MODEL/:id", function (req, resp, next) {
    var OK            = mod.New_Request(arguments);
    var opts          = OK.template_data('MODEL/show_one');
    opts['title']     = "MODEL #" + req.params.id;
    return OK.render_template();
  });

  // ============ CREATE ===============================================
  app.post("/MODEL", function (req, resp, next) {
    var data = _.clone(req.body);
    mod.New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .create_one(function (j, sn) {
      MODEL.create_by_screen_name(sn, data, j);
    })
    .job(function (j, model) {
      resp.json({
        success : true,
        msg     : 'Created: ',
        model   : model
      });
    })
    .run();
  });

}; // ==== exports.routes





