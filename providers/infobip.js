var request = require('request');
var requestUtil = require('../util/request');
var baseUrl = 'https://api.infobip.com/sms/1/text/single';
var INFOBIP_SENDER = '';
var INFOBIP_AUTH = '';
var init = false;

exports.setAuth = function (username, password, sender) {
  if (!username || !password) {
    throw Error('Missing Parameters');
  }
  INFOBIP_SENDER = sender;
  INFOBIP_AUTH = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  init = true;
};

exports.send = function (to, text, cb) {
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
      text: text,
      to: to
    }
  },
    requestUtil.handler(function (err, body) {
      if (err) {
        cb(err);
      } else {
        if (body && body.results && body.results.length) {
          cb(null, body.results[0]);
        } else {
          cb(null, body);
        }
      }
    }));
};
