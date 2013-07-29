"use strict";


$(function () {


}); // ==== jquery on dom ready





function no_reset(o) {
  o.flow.stop();
  o.form.draw_success(o.data.msg);
}

on('before success #Bot_About_Me_Update', no_reset);
on('before success #Bot_Code_Update', no_reset);










