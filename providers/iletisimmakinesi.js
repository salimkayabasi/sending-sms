const util = require('util');
const request = require('request');
const parseString = require('xml2js').parseString;

const baseUrl = 'https://live.iletisimmakinesi.com/api/SingleShotWS/' +
  'functions/sendSingleShotSMS?' +
  'phoneNumber=%s&' +
  'messageText=%s&' +
  'originatorId=%s&' +
  'token=%s';

const tokenUrl = 'https://live.iletisimmakinesi.com/api/UserGatewayWS/' +
  'functions/authenticate?' +
  'userName=%s&' +
  'userPass=%s&' +
  'customerCode=%s&' +
  'apiKey=%s&' +
  'vendorCode=%s';

let USERNAME = '';
let PASSWORD = '';
let CUSTOMER_CODE = '';
let API_KEY = '';
let VENDOR_CODE = '';
let ORIGINATOR = '';
let init = false;

const getToken = (cb) => {
  const url = util.format(tokenUrl, USERNAME, PASSWORD,
    CUSTOMER_CODE, API_KEY, VENDOR_CODE);
  request(url, (err, res, body) => {
    if (err) {
      cb(err);
      return;
    }
    if (res.statusCode !== 200) {
      cb(new Error('Unexpected Auth Error'));
      return;
    }
    parseString(body, { trim: true, attrkey: '@' },
      (parsingError, result) => {
        if (parsingError) {
          cb(parsingError);
          return;
        }
        if (result &&
          result.HERMES_RESPONSE.CONTENT &&
          result.HERMES_RESPONSE.CONTENT.length &&
          result.HERMES_RESPONSE.CONTENT[0] &&
          result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN &&
          result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN.length &&
          result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN[0] &&
          result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN[0].TOKEN_NO &&
          result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN[0].TOKEN_NO.length &&
          result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN[0].TOKEN_NO[0]
        ) {
          cb(null, result.HERMES_RESPONSE.CONTENT[0].AUTHORIZATION_WITH_TOKEN[0].TOKEN_NO[0]);
        } else {
          cb(new Error('Response parse error'), body);
        }
      });
  });
};

exports.setAuth = (username, password, customerCode, apiKey, vendorCode, originatorId) => {
  if (!username || !password || !customerCode || !apiKey || !vendorCode || !originatorId) {
    throw Error('Missing Parameters');
  }

  USERNAME = username;
  PASSWORD = password;
  CUSTOMER_CODE = customerCode;
  API_KEY = apiKey;
  VENDOR_CODE = vendorCode;
  ORIGINATOR = originatorId;
  init = true;
};

exports.send = (to, text, cb) => {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }

  getToken((err, token) => {
    if (err) {
      cb(err);
      return;
    }

    const url = util.format(baseUrl, to, text, ORIGINATOR, token);
    request(url, (requestError, res, body) => {
      if (requestError) {
        cb(requestError);
        return;
      }
      parseString(body, { trim: true, attrkey: '@' },
        (parsingError, result) => {
          if (parsingError) {
            cb(parsingError);
            return;
          }
          cb(null, result);
        });
    });
  });
};
