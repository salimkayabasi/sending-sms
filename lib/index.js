const fs = require('fs');
const path = require('path');
const anglicize = require('anglicize');
const _ = require('lodash');

const providers = {};
const providerNames = _.filter(
  fs.readdirSync(path.resolve(`${__dirname}/../providers`)),
  file => _.endsWith(file, '.js'))
  .map(file => file.replace('.js', ''));

providerNames.forEach((provider) => {
  providers[provider] = require(`../providers/${provider}`);
});

exports.setAuth = (provider, ...params) => {
  if (!_.includes(providerNames, provider)) {
    throw new Error('Not valid provider');
  }
  providers[provider].setAuth.apply(null,
    Array.prototype.slice.call(params));
};

exports.send = (provider, to, text, cb) => {
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

  providers[provider].send(to, anglicize(text).trim(),
    (error, result) => {
      if (error) {
        cb(error);
        return;
      }
      cb(null, {
        to,
        text,
        provider,
        result
      });
    });
};
