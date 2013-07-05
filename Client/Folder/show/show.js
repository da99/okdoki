
$(function () {
  var create_links = '#Create div.link a';
  var creates = '#Creates div.create';

  var reset_creates = function () {
    $(create_links).parent().removeClass('active');
    $(creates).hide();
    reset_form_to_submit_more(creates + ' form');
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
      reset_form_to_submit_more(f);
      console.log(result);
      // $(f).find('button').parent().append(compile_template('div.page_created', {HREF: result.record.location}));
      $('#Pages').prepend(compile_template('div.page', {
        TITLE: result.page.title,
        NUM: result.page.num,
        TIME: time_for_humans((new Date(result.page.created_at)).getTime())}));
    });
  })

});
