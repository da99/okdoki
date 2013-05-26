
$(function () {
  var create_links = '#Create div.link a';

  on_click($(create_links), function (e) {
    var l = $(this);
    var parent = $(l.parent());

    if (parent.hasClass('active'))
      return;

    // reset
    $(create_links).parent().removeClass('active');
    $('#Creates div.create').hide();

    // set
    parent.addClass('active');
    $(l.attr('href')).show();

    return;
  });
});
