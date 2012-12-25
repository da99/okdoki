
$(function () {
  $("div.screen_name div.options input[type='checkbox']").change(function () {
    var box = $(this).closest("div.options");
    box.addClass('loading');
    setTimeout(function () {
      box.removeClass('loading');
    }, 500);
  });

  $("div.screen_name div.options button").click(function () {
    var box = $(this).closest("div.options");
    box.addClass('loading');
    setTimeout(function () {
      box.removeClass('loading');
    }, 500);
  });

  $('textarea').focus( function () {
    var txt = $(this).val();
    if (txt === 'Type your question here.' || txt === 'Type your reason here.') {
      $(this).val('');
      $(this).removeClass('blurred');
    };
  });
});
