var twilio = require('twilio');

var TWILIO_SENDER = '';
var TWILIO_CLIENT;
var init = false;

exports.setAuth = function (accountSID, authToken, sender) {
  if (!accountSID || !authToken || !sender) {
    throw Error('Missing Parameters');
  }
  TWILIO_SENDER = sender;
  TWILIO_CLIENT = new twilio.RestClient(accountSID, authToken);
  init = true;
};

exports.send = function (to, text, cb) {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }
  TWILIO_CLIENT.messages.create({
    body: text,
    to: to,
    from: TWILIO_SENDER
  }, cb);
};
