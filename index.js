var anglicize = require('anglicize');
var log = require('kapgel-logger')(module);
var phone = require('phone');
var sms = require('./sms');
var _ = require('lodash');
var async = require('async');
var smsMaxLength = 160;
var invalidOptions = new Error('Has missing params');
invalidOptions.status = 400;

var hasMissingParams = function (smsOptions) {
  switch (smsOptions.providerName) {
    case 'infobip' :
      if (!smsOptions.username || !smsOptions.password) {
        return true;
      }
      return false;
    case 'clickatell':
      if (!smsOptions.apiId || !smsOptions.username ||
        !smsOptions.password) {
        return true;
      }
      return false;
    case 'mobildev':
      if (!smsOptions.username || !smsOptions.company ||
        !smsOptions.password || !smsOptions.action) {
        return true;
      }
      return false;
    default:
      return true;
  }
};

exports.send = function (options, to, text, cb) {
  if (hasMissingParams(options)) {
    cb(invalidOptions);
    return;
  }
  if (_.isNaN(to)) {
    cb(new Error('Phone number is required'));
    return;
  }
  if (_.isNaN(text) || !text.length) {
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
    to = p[0];
  } else {
    var phoneError = new Error('PhoneNumber is not suitable for sending SMS');
    phoneError.status = 400;
    if (phoneError) {
      log.error(phoneError);
    }
    cb(phoneError);
    return;
  }

  if (to.indexOf('+905') === 0) {
    async.each(messages, sms.send.bind(null, options, to), function (smsResult) {
      if (smsResult.status && smsResult.status === 400) {
        cb(smsResult);
        return;
      }
      var smsObject = {
        phone: to,
        text: text,
        provider: options.providerName,
        result: smsResult
      };
      cb(null, smsObject);
      return;
    });
  } else {
    var err = new Error('SMS Service is not enabled or PhoneNumber is not suitable');
    err.status = 400;
    cb(err);
    return;
  }
};

exports.createMessageForRecipient = function (delivery) {
  if (!delivery.owner) {
    if (delivery.orderNo) {
      return delivery.orderNo + ' nolu siparişiniz yola çıkmıştır';
    }
    return 'Siparişiniz yola çıkmıştır';
  }
  return (delivery.owner.name + ' tarafından gönderilen ' +
  delivery.orderNo + ' nolu siparişiniz yola çıkmıştır.');
};

exports.sendSMSToRecipient = function (options, delivery, cb) {
  if (hasMissingParams(options)) {
    cb(invalidOptions);
    return;
  }
  var self = this;
  if (!delivery.recipient) {
    var err = new Error('recipient not found');
    cb(err);
    return;
  }
  self.send(options, delivery.recipient.phone,
    self.createMessageForRecipient(delivery),
    cb);
};

exports.sendTempPass = function (operation, options, user, cb) {
  if (hasMissingParams(options)) {
    cb(invalidOptions);
    return;
  }
  var self = this;
  var text;
  if (operation === 'activation') {
    text = 'KapGel\'e hosgeldiniz. Aktivasyon kodunuz: ' + user.tempPass;
  } else if (operation === 'reactivate') {
    text = 'Yeni aktivasyon kodunuz ' + user.tempPass +
      ' olarak güncellenmiştir';
  } else {
    cb(new Error('Invalid Operation'));
    return;
  }
  self.send(options, user.phone, text, cb);
};

exports.test = {
  hasMissingParamsTest: function (smsOptions) {
    return hasMissingParams(smsOptions);
  },
  sendTest: function (options, to, text, callback) {
    exports.send(options, to, text, callback);
  },
  createMessageForRecipientTest: function (delivery) {
    return exports.createMessageForRecipient(delivery);
  },
  sendSMSToRecipientTest: function (options, delivery, callback) {
    exports.sendSMSToRecipient(options, delivery, callback);
  },
  sendTempPassTest: function (operation, options, user, callback) {
    exports.sendTempPass(operation, options, user, callback);
  }
};
