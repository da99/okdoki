
var _         = require('underscore')
, OK          = require('okdoki/lib/routes/router').OK
;


OK.get( '/news-feed', function (req, resp, next) {
  if (!req.user)
    return write.json_success(resp, "You need to be logged in.", {items: []});

  New_River(next)
  .job('read_feed', req.user.data.id, [Post, 'read_feed', req.user])
  .run(function (r) {
    write.json_success(resp,"Here is your feed.", {items: r.flatten_results()});
  });
});


// ****************************************************************
// *************** CREATE *****************************************
// ****************************************************************

OK.post('/post/:name', function (req, resp, next) {
  if (!req.user)
    return write.json_fail(resp, "You are not logged in.");

  var n = req.params.name;
  var r = New_River(next);
  r
  .job('read_by_screen_name', n, [Customer, 'read_by_screen_name', n])
  .job('prepare-post', n, function (j, c) {
    var vals = {
      ip                   : req.ip,
      customer_screen_name : n,
      author               : req.user,
      author_screen_name   : req.body.as,
      body                 : req.body.post_body,
      section_name         : req.body.section_name
    };

    var msg = null;
    switch (req.body.section_name) {
      case 'question':
        msg = "Question has been saved."
      break;
      case 'cheer':
        msg = "You have cheered this person."
      break;
      case 'jeer':
        msg = "You have boo-ed this person."
      break;
      default:
        msg = "Saved."
    };

    j.river.data({
      msg       : msg,
      customer  : c,
      post_vals : vals
    });

    j.finish();
  })

  .on_next('invalid', function (j) {
    write.json_fail(resp, j.invalid_msg);
  })
  .job('create_post', n, function (j) {
    var c = j.river.data('customer');
    Post.create(c, j.river.data('post_vals'), j);
  })

  .on_finish(function (r) {
    var record = r.last_reply();
    write.json_success(resp, r.data('msg'), {rows: [record.public_data()]});
  })

  .run();

});


OK.post('/create-account', function (req, resp, next) {

  var data = req.body;

  var vals = {
    screen_name        : data.screen_name,
    pass_phrase         : data.pass_phrase,
    confirm_pass_phrase : data.confirm_pass_phrase,
    email              : data.email,
    ip                 : req.ip
  };

  var r = New_River(next);
  r

  .on_next('invalid', function (j) {
    write.json_fail(resp, j.invalid_msg);
  })
  .job('create-customer', vals.screen_name, [Customer, 'create', vals])

  .run(function (r, save_customer) {
    req.login(mem, function(err) {
      if (err)
        return next(err);
      return write.json_success(resp, "Account created.");
    });
  });


});

OK.post('/create/screen_name', function (req, resp, next) {
  var n = req.body.screen_name;
  New_River(next)
  .on_next('invalid', function (j) {
    return write.json_fail(resp, j.invalid_msg);
  })
  .job('create-screen-name', [Screen_Name, 'create', req.user, n])

  .run(function () {
    write.json_success(resp,
                       "Screen name created: " + n + '. Please wait as homepage loads.', 
                       { screen_name: n }
                      );
  });

});
