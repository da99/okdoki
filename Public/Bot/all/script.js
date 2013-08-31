
$(function () {
  on_click('a.on',  function () {
    var a = $(this);
    if (a.hasClass('is_on'))
        return;
    var header = a.parent('div.header');
    header.addClass('loading');
  });
  on_click('a.off', function () {
    var a = $(this);
    if (a.hasClass('is_off'))
        return;
  });
});
