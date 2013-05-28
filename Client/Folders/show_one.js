
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

  // === forms
  $(creates).each(function (i, e) {
    var form_se = '#' + $(e).attr('id') + ' form';
    form(form_se, function (f) {
      f.on_success(function (result) {
        reset_creates();
        log(result);
      });
    });
  });

});
