var fs = require('fs');
var path = require('path');
var anglicize = require('anglicize');
var _ = require('lodash');
var providers = {};
var providerNames = _.filter(
  fs.readdirSync(path.resolve(__dirname + '/../providers')),
  function (file) {
    return _.endsWith(file, '.js');
  })
  .map(function (file) {
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

  providers[provider].send(to, text,
    function (error, result) {
      if (error) {
        cb(error);
        return;
      }
      cb(null, {
        phone: result.to,
        text: text,
        provider: provider,
        result: result.response
      });
    });
};
