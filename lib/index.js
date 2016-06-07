var fs = require('fs');
var anglicize = require('anglicize');
var log = require('kapgel-logger')(module);
var phone = require('phone');
var _ = require('lodash');
var async = require('async');
var smsMaxLength = 160;
var providers = {};
var providerNames = _.filter(fs.readdirSync('./providers/'), function (file) {
  return _.endsWith(file, '.js');
}).map(function (file) {
  return file.replace('.js', '');
});

providerNames.forEach(function (provider) {
  providers[provider] = require('../providers/' + provider);
});

exports.setAuth = function setAuth(provider) {
  if (!_.includes(providerNames, provider)) {
    throw new Error('Not valid provider');
  }
  providers[provider].setAuth.apply(null,
    Array.prototype.slice.call(arguments).slice(1));
};

exports.send = function (provider, to, text, cb) {
  if (!_.includes(providerNames, provider)) {
    cb(new Error('Not valid provider'));
    return;
  }
  if (!(to && to.length)) {
    cb(new Error('Phone number is required'));
    return;
  }
  if (!(text && text.length)) {
    cb(new Error('Message is required'));
    return;
  }
  text = anglicize(text).trim();
  var messages = [];

  var i = 0;
  if (text.length < smsMaxLength) {
    messages.push(text);
  } else {
    while (text.length) {
      // !!!: Not sure if this case still exists. ~ea
      var message = text;
      // suggested sms length is 157
      // because we will add order number
      // this order number may have 2 digits
      if (message.length >= smsMaxLength - 2) {
        message = text.slice(0, smsMaxLength - 3);
        var lastSpaceIndex = message.lastIndexOf(' ');
        if (lastSpaceIndex !== -1) {
          message = message.slice(0, lastSpaceIndex).trim();
        }
      }
      messages.push(++i + ' ' + message);
      text = text.slice(message.length).trim();
    }
  }
  var p = phone(to, 'TUR');

  if (p.length === 2 && p[0].indexOf('+905') === 0 && p[0].length === 13) {
    to = p[0].replace('+', '');
  } else {
    var phoneError = new Error('PhoneNumber is not suitable for sending SMS');
    phoneError.status = 400;
    if (phoneError) {
      log.error(phoneError);
    }
    cb(phoneError);
    return;
  }

  async.each(messages, providers[provider].send.bind(null, to),
    function (err, response) {
      if (err) {
        cb(err);
        return;
      }
      cb(null, {
        phone: to,
        text: text,
        provider: provider,
        result: response
      });
    });
};
