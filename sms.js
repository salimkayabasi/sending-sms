var request = require('request');
var util = require('util');
var url;
var result;
var baseUrl;
exports.send = function (options, to, text, cb) {
  switch (options.providerName) {
    case 'infobip':
      baseUrl = 'http://api.infobip.com/api/v3/sendsms/json';
      to = to.replace('+', '');
      var smsBody = {
        authentication: {
          username: options.username,
          password: options.password
        },
        messages: [{
          sender: 'KapGel',
          text: text,
          recipients: [{ gsm: to }]
        }]
      };
      request.post({
        url: baseUrl,
        json: true,
        body: smsBody
      },
        function (err, response, body) {
          if (!err && response.statusCode === 200) {
            result = typeof body === 'object' ? JSON.stringify(body) : body;
            cb(result);
            return;
          }
          var smsError = new Error('An error occured on sms sending');
          smsError.status = 400;
          cb(smsError);
          return;
        });
      break;
    case 'clickatell':
      baseUrl = 'https://api.clickatell.com/http/sendmsg?api_id=%s&user=%s&' +
        'password=%s&to=%s&text=%s';
      url = util.format(baseUrl, options.apiId, options.username,
        options.password, to, text);
      request(url, function (err, response, body) {
        if (!err && response.statusCode === 200) {
          result = typeof body === 'object' ? JSON.stringify(body) : body;
          cb(result);
          return;
        }
        var smsError = new Error('An error occured on sms sending');
        smsError.status = 400;
        cb(smsError);
        return;
      });
      break;
    case 'mobildev':
      baseUrl = 'https://secure.mobilus.net/sms/gateway.asp?username=%s&' +
        'company=%s&password=%s&action=%s&message=%s&numbers=%s';
      to = to.replace('+', '');
      url = util.format(baseUrl, options.username, options.company,
        options.password, options.action, text, to);
      request(url, function (err, response, body) {
        if (cb) {
          if (!err && response.statusCode === 200) {
            result = typeof body === 'object' ? JSON.stringify(body) : body;
            cb(result);
            return;
          }
          var smsError = new Error('An error occured on sms sending');
          smsError.status = 400;
          cb(smsError);
          return;
        }
      });
      break;
    default:
      break;
  }
};
