
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
    .job(function (j) {
      MODEL.create(data, j);
    })
    .job(function (j, page) {
      resp.json({
        success : true,
        msg     : 'Created: '
      });
    })
    .run();
  });

}; // ==== exports.routes





