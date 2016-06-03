var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
var SMS = require('../');
var text = process.env.TEXT;
var phone = process.env.PHONE;

SMS.setAuth('infobip', process.env.INFOBIP_USERNAME, process.env.INFOBIP_PASSWORD);

describe('Sms Tests', function () {
  it('should send sms', function (done) {
    SMS.send('infobip', phone, text, function (err, sms) {
      expect(err).not.to.exist();
      expect(sms).to.exist();
      done();
    });
  });
  //it('should return error for missing params', function (done) {
  //  smsOptions = {
  //  };
  //  expect(index.test.hasMissingParamsTest(smsOptions)).to.be.true();
  //  done();
  //});
  //it('should not return error for missing params', function (done) {
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA',
  //    providerName: 'infobip'
  //  };
  //  expect(index.test.hasMissingParamsTest(smsOptions)).to.be.false();
  //  done();
  //});
  //it('should not send sms with missing params', function (done) {
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA'
  //  };
  //  SMS.send('infobip', phone, text, function (err) {
  //    expect(err).to.exist();
  //    done();
  //  });
  //});

  //it('should create message for recipient', function (done) {
  //  expect(index.test.createMessageForRecipientTest(delivery)).to.exist();
  //  done();
  //});
  //it('should not send sms to recipient', function (done) {
  //  delivery = {
  //    orderNo: 'abcd1234'
  //  };
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA',
  //    providerName: 'infobip'
  //  };
  //  index.test.sendSMSToRecipientTest(smsOptions, delivery, function (err) {
  //    expect(err).to.exist();
  //    done();
  //  });
  //});
  //it('should send sms to recipient', function (done) {
  //  delivery = {
  //    recipient: {
  //      phone: phone
  //    },
  //    orderNo: 'abcd1234'
  //  };
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA',
  //    providerName: 'infobip'
  //  };
  //  index.test.sendSMSToRecipientTest(smsOptions, delivery, function (err, sms) {
  //    expect(sms).to.exist();
  //    done();
  //  });
  //});
  //it('should not send temp password', function (done) {
  //  user = {
  //    tempPass: '123456',
  //    phone: phone
  //  };
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA',
  //    providerName: 'infobip'
  //  };
  //  index.test.sendTempPassTest('asd', smsOptions, user, function (err) {
  //    expect(err).to.exist();
  //    done();
  //  });
  //});
  //it('should send temp password', function (done) {
  //  user = {
  //    tempPass: '123456',
  //    phone: phone
  //  };
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA',
  //    providerName: 'infobip'
  //  };
  //  index.test.sendTempPassTest('reactivate', smsOptions, user, function (err, sms) {
  //    expect(sms).to.exist();
  //    done();
  //  });
  //});
  //it('should send activation code', function (done) {
  //  user = {
  //    tempPass: '123456',
  //    phone: phone
  //  };
  //  smsOptions = {
  //    username: 'KapGel',
  //    password: 'x8YMDqPA',
  //    providerName: 'infobip'
  //  };
  //  index.test.sendTempPassTest('activation', smsOptions, user, function (err, sms) {
  //    expect(sms).to.exist();
  //    done();
  //  });
  //});
});
