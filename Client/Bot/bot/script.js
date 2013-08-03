"use strict";


$(function () {

  on_click('#Code a.show_more', function () {
    $(this).parent().hide();
    $(this).parents('div.update_code').find('div.show').show();
  });

  on_click('#Code a.show_less', function () {
    $(this).parents('div.update_code').find('div.show').hide();
    $(this).parents('div.update_code').find('div.show_more').show();
  });

}); // ==== jquery on dom ready





function no_reset(o) {
  o.flow.stop();
  o.form.draw_success(o.data.msg);
}

on('before success #Bot_About_Me_Update', no_reset);
on('before success #Bot_Code_Update', no_reset);










