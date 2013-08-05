
var _ = require("underscore")._
, Ok  = require("../Ok/model").Model
, log = require("../App/base").log
, F   = require("tally_ho").Tally_Ho
;

var MODEL     = Ok.MODEL
, Screen_Name = Ok.Screen_Name
;

exports.route = function (mod) {
  var app = mod.app;

  // ============ CREATE ===============================================

  app.post("/MODEL", function (req, resp, next) {

    var data = _.pick(req.body, as_this_life);

    req.Ok.run(
      'create MODEL', data,
      function (f) {
        resp.json({
          success : true,
          msg     : 'Created: ',
          model   : f.last.model.to_client_side()
        });
      }
    );

  });

  // ============ READ =================================================

  app.get("/MODEL/:id", function (req, resp, next) {
    req.Ok.run(
      "read MODEL", {id: req.params.id},
      resp.Ok.if_not_found("MODEL not found: " + id),
      function (f) {
        var model = f.val.public_data();
        resp.Ok.render_template('Model/model', {
          title: "Model: id"
        });
      }
    );
  });

}; // ==== exports.routes





