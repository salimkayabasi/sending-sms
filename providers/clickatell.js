var util = require('util');
var request = require('request');
var requestUtil = require('../util/request');
var baseUrl = 'https://api.clickatell.com/http/sendmsg?api_id=%s&user=%s&' +
  'password=%s&from=%s&to=%s&text=%s';
var CLICKATELL_USERNAME = '';
var CLICKATELL_PASSWORD = '';
var CLICKATELL_FROM = '';
var CLICKATELL_ID = '';
var init = false;

exports.setAuth = function (username, password, from, apiId) {
  CLICKATELL_USERNAME = username;
  CLICKATELL_PASSWORD = password;
  CLICKATELL_FROM = from;
  CLICKATELL_ID = apiId;
  init = true;
};

exports.send = function (to, text, cb) {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }
  var url = util.format(baseUrl, CLICKATELL_ID, CLICKATELL_USERNAME,
    CLICKATELL_PASSWORD, CLICKATELL_FROM, to, text);
  request(url,
    requestUtil.handler(function (err, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    }));
};
