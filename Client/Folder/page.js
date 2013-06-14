
$(function () {
  form( '#Creates form', function (f) {
    f.at_least_one_not_empty('input[name="title"]', 'textarea[name="body"]');

    f.on_success(function (result) {
      reset_forms(f);
      var last_id  = $('#Items div.item').last().attr('id');
      var pieces = last_id.split('_');
      var num_id = pieces.pop();
      var prefix = pieces.join('_');
      var new_id = prefix + '_' + parseInt(num_id);

      var data = {TITLE: result.record[0], BODY: result.record[1]};
      var new_e = (result.record[0]) ?
        compile_template('div.with_title', data) :
        compile_template('div.item', data);
      new_e.attr('id', new_id);
      $('div.items').append(new_e);
    });
  });


  // ==============================================
  // ============= Edit This Page =================
  // ==============================================
  var button = $('#Me div.edit a');
  on_click(button, function (e) {
    $(button).parent().hide();
    $('#Update_Page').show();
    $('#Items div.list').hide();
  });

  on_click('#Update_Page a.cancel', function (e) {
    $(button).parent().show();
    $('#Items div.list').show();
    $('#Update_Page').hide();
  });

  // ==============================================
  // ============= Style this article. ============
  // ==============================================
  var The_Page = $('#The_Page_Content');
  var content = $.trim(The_Page.text());
  content = (content.replace( /\*(.+)\*\s+\[(.+)\]/ig, function (a , b , c) {
    log(a, b, c)
    var l = $('<a></a>');
    l.attr('href', c);
    l.text(b);
    var p = $('<p></p>');
    p.append(l);
    return p.html();
  }));
  content = (content.replace( /^Section:\s+(.+)$/mig, function (a , b) {
    log(a, b)
    return "<h3>" + $.trim(b) + "</h3>";
  }));
  content = (content.replace( /\/(.+)\//g, function (a , b) {
    log(a, b)
    return "<i>" + b + "</i>";
  }));
  content = (content.replace( /\*(.+)\*/g, function (a , b) {
    log(a, b)
    return "<strong>" + b + "</strong>";
  }));

  The_Page.html(content);

}); // ==== DOM ready






