const twilio = require('twilio');

let TWILIO_SENDER = '';
let TWILIO_CLIENT;
let init = false;

exports.setAuth = (accountSID, authToken, sender) => {
  if (!accountSID || !authToken || !sender) {
    throw Error('Missing Parameters');
  }
  TWILIO_SENDER = sender;
  TWILIO_CLIENT = new twilio.RestClient(accountSID, authToken);
  init = true;
};

exports.send = (to, text, cb) => {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }
  TWILIO_CLIENT.messages.create({
    body: text,
    to,
    from: TWILIO_SENDER
  }, cb);
};
