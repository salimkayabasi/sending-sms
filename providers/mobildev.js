const util = require('util');
const request = require('request');
const requestUtil = require('../util/request');

const baseUrl = 'https://secure.mobilus.net/sms/gateway.asp?username=%s&' +
  'password=%s&company=%s&action=%s&numbers=%s&message=%s';
let MOBILDEV_USERNAME = '';
let MOBILDEV_PASSWORD = '';
let MOBILDEV_COMPANY = '';
let MOBILDEV_ACTION = '';
let init = false;

exports.setAuth = (username, password, company, action) => {
  if (!username || !password || !company || !action) {
    throw Error('Missing Parameters');
  }
  MOBILDEV_USERNAME = username;
  MOBILDEV_PASSWORD = password;
  MOBILDEV_COMPANY = company;
  MOBILDEV_ACTION = action;
  init = true;
};

exports.send = (to, text, cb) => {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }
  const url = util.format(baseUrl, MOBILDEV_USERNAME, MOBILDEV_PASSWORD,
    MOBILDEV_COMPANY, MOBILDEV_ACTION, to, text);
  request(url,
    requestUtil.handler((err, body) => {
      if (err) {
        cb(err);
      } else {
        cb(null, body);
      }
    }));
};
