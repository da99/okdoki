
  app.get('/me/:screen_name', function (req, resp, next) {
    if (req.params.screen_name.toUpperCase() !== req.params.screen_name)
      return resp.redirect(301, "/me/" + req.params.screen_name.toUpperCase())
    var OK     = mod.New_Request(req, resp, next);
    var data   = null;

    mod.New_River(req, resp, next)
    .read_one('screen_name', function (j) {
      Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
    })
    .read_one('website', function (j, sn) {
      Website.read_by_screen_name(sn, j);
    })
    .read_list('follows', function (j, website) {
      if (!req.user)
        return j.finish([]);
      Follow.read_list_by_website_and_customer(website, req.user, j);
    })
    .read_one('folders', function (j) {
      Folder.read_list_by_website(j.river.reply_for('website'), j)
    })
    .job(function (j, list) {
      if (!list)
        return req.next();
      var uni = list.website;
      data               = OK.template_data('Screen_Name/me/me');
      data['title']      = uni.data.title || req.params.screen_name;
      data['website']    = uni;
      data['website_id'] = uni.data.id;
      data['folders']    = list.list;
      data['is_following']  = !!j.river.reply_for('follows').length;
      OK.render_template();
    })
    .run();
  });
