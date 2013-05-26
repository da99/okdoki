
$(function () {
  var create_links = '#Create div.link a';
  var creates = '#Creates div.create';

  var reset_creates = function () {
    $(create_links).parent().removeClass('active');
    $(creates).hide();
  };

  on_click($(creates).find('a.cancel'), reset_creates);

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
});
