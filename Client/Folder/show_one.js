
$(function () {
  var create_links = '#Create div.link a';
  var creates = '#Creates div.create';

  var reset_creates = function () {
    $(create_links).parent().removeClass('active');
    $(creates).hide();
    reset_forms(creates + ' form');
  };

  on_click($(creates).find('a.cancel'), reset_creates);

  // === show links
  on_click($(create_links), function (e) {
    var l = $(this);
    var parent = $(l.parent());

    if (parent.hasClass('active'))
      return;

    // reset
    reset_creates();

    // set
    parent.addClass('active');
    $(l.attr('href')).show();
  });

  // === Update page created pages
  $('div.page span.time').each(function (i, raw_o) {
    var o = $(raw_o);
    o.text(time_for_humans(parseInt(o.text())));
  });

  // === Create Page
  form( '#Page form', function (f) {
    f.on_success(function (result) {
      reset_forms(f);
      // $(f).find('button').parent().append(compile_template('div.page_created', {HREF: result.record.location}));
      $('#Pages').prepend(compile_template('div.page', {TITLE: result.record.title, HREF: result.record.location, TIME: time_for_humans(result.record.created_at)}));
    });
  })

});
