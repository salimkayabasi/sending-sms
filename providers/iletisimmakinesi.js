var util = require('util');
var request = require('request');
var parseString = require('xml2js').parseString;
var baseUrl = 'https://live.iletisimmakinesi.com/api/SMSGatewayWS/' +
  'functions/sendSMS?' +
  'phoneNumbers=["%s"]&' +
  'templateText=%s&' +
  'originatorId=%s&' +
  'token=%s&' +
  'isUTF8Allowed=false&' +
  'validityPeriod=60';

var tokenUrl = 'https://live.iletisimmakinesi.com/api/UserGatewayWS/' +
  'functions/authenticate?' +
  'userName=%s&' +
  'userPass=%s&' +
  'customerCode=%s&' +
  'apiKey=%s&' +
  'vendorCode=%s';

var USERNAME = '';
var PASSWORD = '';
var CUSTOMER_CODE = '';
var API_KEY = '';
var VENDOR_CODE = '';
var ORIGINATOR = '';
var init = false;

var getToken = function (cb) {
  var url = util.format(tokenUrl, USERNAME, PASSWORD,
    CUSTOMER_CODE, API_KEY, VENDOR_CODE);
  request(url, function (err, res, body) {
    if (err) {
      cb(err);
      return;
    }
    if (res.statusCode !== 200) {
      cb(new Error('Unexpected Auth Error'));
      return;
    }
    parseString(body, { trim: true },
      function (parsingError, result) {
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

exports.setAuth = function (username, password, customerCode, apiKey, vendorCode, originatorId) {
  if (!username || !password || !customerCode || !apiKey || !vendorCode && !originatorId) {
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

exports.send = function (to, text, cb) {
  if (!init) {
    cb(new Error('Init required'));
    return;
  }

  getToken(function (err, token) {
    if (err) {
      cb(err);
      return;
    }

    var url = util.format(baseUrl, to, text, ORIGINATOR, token);
    request(url, function (requestError, res, body) {
      if (requestError) {
        cb(requestError);
        return;
      }
      parseString(body, { trim: true },
        function (parsingError, result) {
          if (parsingError) {
            cb(parsingError);
            return;
          }
          cb(null, result);
        });
    });
  });
};
