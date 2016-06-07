var request = require('request');
var requestUtil = require('../util/request');
var baseUrl = 'http://api.infobip.com/api/v3/sendsms/json';
var INFOBIP_USERNAME = '';
var INFOBIP_PASSWORD = '';
var init = false;

exports.setAuth = function (username, password) {
  if (!username || !password) {
    throw Error('Missing Parameters');
  }
  INFOBIP_USERNAME = username;
  INFOBIP_PASSWORD = password;
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
    body: {
      authentication: {
        username: INFOBIP_USERNAME,
        password: INFOBIP_PASSWORD
      },
      messages: [{
        sender: 'KapGel',
        text: text,
        recipients: [{ gsm: to }]
      }]
    }
  },
    requestUtil.handler(function (err, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    }));
};
