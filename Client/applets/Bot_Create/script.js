"use strict";


on('after success #Bot_Create', function (o) {
  console.log(o)
  // window.location.href = '/bot/' + o.data.bot.screen_name;
});
