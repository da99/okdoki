
Intro
-----
The node/express version of okdoki.com.



How to Make a Bot
-----------------

All commands are regular HTTP POST ajax requests. The bot (ie web app)
gets sent a FORM params. Your web app (ie bot) returns mime-type:

    application/json

Content of HTTP response is valid JSON:

    JSON.stringify({ msg: "....", success: true });

Set `success` to `false` for failures:

    JSON.stringify({ msg: "Dude?! No idea what you saying... check spelling...", success: false });

To ask to have robot listed, send the following command. Your request will be put on a queue to be reviewed, tested, and accepted/rejected/hiatus.

    @okdoki Please publish: HTTP_ADDRESS Contact: EMAIL_or_TWITTER

To check status of your bot listing request:

    @okdoki Status for: HTTP_ADDRESS
