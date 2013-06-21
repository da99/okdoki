
$(function () {
  var edit_button = $('#Edit_This_Page a');
  var cancel_button = $('#Update_Page a.cancel');

  form( '#Update_Page', function (f) {
    f.at_least_one_not_empty('input[name="title"]', 'textarea[name="body"]');

    f.on_success(function (result) {
      $(cancel_button).click();
      $('#Success_Msg').show();
      $('#The_Title').text(result.page.title);
      $('#Update_Page div.title input[type="text"]').val(result.page.title);
      document.title = result.page.title;
      $('#The_Page_Content').html(result.page.html_body);
      $('#The_Body').text(result.page.body);
      log(result);
    });
  });


  // ==============================================
  // ============= Edit This Page =================
  // ==============================================
  on_click(edit_button, function (e) {
    $(edit_button).parent().hide();
    $('#Update_Page').show();
    $('#Items div.list').hide();
    $('#Success_Msg').hide();
  });

  on_click(cancel_button, function (e) {
    $(edit_button).parent().show();
    $('#Items div.list').show();
    $('#Update_Page').hide();
  });

  // ==============================================
  // ============= Style this article. ============
  // ==============================================
  var The_Page = $('#The_Page_Content');
  var content = $.trim(The_Page.text());

  The_Page.html(content);

}); // ==== DOM ready






