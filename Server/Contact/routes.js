// ================================================================
// ================== CONTACTS ====================================
// ================================================================

exports.route = function (mod) {

  var app = mod.app;

  app.post("/contacts/online", require_log_in, function (req, resp, next) {

    New_River(next)
    .job('contact is online', req.user.data.id, [Contact, 'is_online', req.user])
    .on_finish(function (r) {
      var OK = New_Request(arguments);
      return OK.json_success('FIN.', {contacts: r.last_reply()});
    })
    .run();

  });

  app.put("/contacts/:contact_user_name", function (req, resp, next) {
    var new_vals = {
      contact_screen_name: req.params.contact_screen_name,
      as: req.body.as,
      is_trashed: req.body.is_trashed
    };

    var r = New_River(next);
    r.job('update contact', new_vals.contact_screen_name, [Contact, 'update', req.user, new_vals]);
    r.run(function () {
      var OK = New_Request(arguments);
      OK.json_success("Saved.");
    });
  });

}; // === exports.route



