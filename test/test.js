var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
var SMS = require('../');
var text = process.env.TEXT;
var phone = process.env.PHONE;

describe('Sms Tests', function () {
  it('should give init error', function (done) {
    SMS.send('infobip', phone, text, function (err, sms) {
      expect(err.message).to.equal('Init required');
      expect(sms).not.to.exist();
      done();
    });
  });
  it('should give missing parameters error', function (done) {
    try {
      SMS.setAuth('infobip', process.env.INFOBIP_USERNAME);
    } catch (error) {
      expect(error).to.exist();
      expect(error.message).to.equal('Missing Parameters');
      done();
    }
  });
  it('should give invalid provider error', function (done) {
    try {
      SMS.setAuth('testprovider');
    } catch (error) {
      expect(error).to.exist();
      expect(error.message).to.equal('Not valid provider');
      done();
    }
  });
  it('should send sms', function (done) {
    SMS.setAuth('infobip', process.env.INFOBIP_USERNAME, process.env.INFOBIP_PASSWORD);
    SMS.send('infobip', phone, text, function (err, sms) {
      expect(err).not.to.exist();
      expect(sms).to.exist();
      done();
    });
  });
});
