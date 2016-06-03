var util = require('util');
var request = require('request');
var requestUtil = require('../util/request');
baseUrl = 'https://secure.mobilus.net/sms/gateway.asp?username=%s&' +
  'password=%s&company=%s&action=%s&numbers=%s&message=%s';
var MOBILDEV_USERNAME = '';
var MOBILDEV_PASSWORD = '';
var MOBILDEV_COMPANY = '';
var MOBILDEV_ACTION = '';
var init = false;

exports.setAuth = function (username, password, company, action) {
  MOBILDEV_USERNAME = username;
  MOBILDEV_PASSWORD = password;
  MOBILDEV_COMPANY = company;
  MOBILDEV_ACTION = action;
  init = true;
};

exports.send = function (to, text, cb) {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }
  var url = util.format(baseUrl, MOBILDEV_USERNAME, MOBILDEV_PASSWORD,
    MOBILDEV_COMPANY, MOBILDEV_ACTION, to, text);
  request(url,
    requestUtil.handler(function (err, body) {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    }));
};
