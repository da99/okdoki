
$(function () {
  on_click('#Create a[href="#create_folder"]', function (e) {
    var path          = window.location.pathname;
    var parent        = $(this).parent();
    var orig_text     = $(this).text();
    var link          = $(this);
    var id            = 'create_folder_loading' ;
    var ele           = $('<div class="loading ' + id + '">Processing...</div>');

    $(this).after(ele);
    $(this).hide();

    post((path + '/create/folder').replace('//', '/'), function (err, results) {
      ele.remove();

      if (err) {

        log(err, results);

        var err_id = 'create_folder_error';
        var min_15  = (1000 * 60 * 15);
        link.after($('<div class="errors ' + err_id + '">Error occurred. Try again in...</div>'));
        countdown($(parent).find('div.' + err_id), function (target, since) {
          if (since > min_15) {
            link.show();
            target.remove();
            return;
          }
          target.text('Error occurred. Try again in ' + min_sec(min_15 - since) + ' mins.');
          return true;
        });

        return;
      }

      link.show();
    });

    log(orig_text);
  });
});
