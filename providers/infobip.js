const request = require('request');
const requestUtil = require('../util/request');

const baseUrl = 'https://api.infobip.com/sms/1/text/single';
let INFOBIP_SENDER = '';
let INFOBIP_AUTH = '';
let init = false;

exports.setAuth = (username, password, sender) => {
  if (!username || !password) {
    throw Error('Missing Parameters');
  }
  INFOBIP_SENDER = sender;
  INFOBIP_AUTH = `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;
  init = true;
};

exports.send = (to, text, cb) => {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }

  request.post({
    url: baseUrl,
    json: true,
    headers: {
      Authorization: INFOBIP_AUTH
    },
    body: {
      from: INFOBIP_SENDER,
      text,
      to
    }
  },
    requestUtil.handler((err, body) => {
      if (err) {
        cb(err);
      } else if (body && body.results && body.results.length) {
        cb(null, body.results[0]);
      } else {
        cb(null, body);
      }
    }));
};
