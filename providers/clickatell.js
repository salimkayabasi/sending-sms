const util = require('util');
const request = require('request');
const requestUtil = require('../util/request');

const baseUrl = 'https://api.clickatell.com/http/sendmsg?api_id=%s&user=%s&' +
  'password=%s&from=%s&to=%s&text=%s';
let CLICKATELL_USERNAME = '';
let CLICKATELL_PASSWORD = '';
let CLICKATELL_FROM = '';
let CLICKATELL_ID = '';
let init = false;

exports.setAuth = (username, password, from, apiId) => {
  if (!username || !password || !from || !apiId) {
    throw Error('Missing Parameters');
  }
  CLICKATELL_USERNAME = username;
  CLICKATELL_PASSWORD = password;
  CLICKATELL_FROM = from;
  CLICKATELL_ID = apiId;
  init = true;
};

exports.send = (to, text, cb) => {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }
  const url = util.format(baseUrl, CLICKATELL_ID, CLICKATELL_USERNAME,
    CLICKATELL_PASSWORD, CLICKATELL_FROM, to, text);
  request(url, requestUtil.handler((err, body) => {
    if (err) {
      cb(err);
    } else {
      cb(null, body);
    }
  }));
};
